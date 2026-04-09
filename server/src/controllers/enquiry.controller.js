const supabase = require('../config/supabase');
const { v4: uuidv4 } = require('uuid');

exports.createEnquiry = async (req, res, next) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    const enquiryId = uuidv4();
    const { data: enquiry, error } = await supabase
      .from('enquiries')
      .insert({
        id: enquiryId,
        name,
        email,
        phone,
        subject,
        message,
        status: 'new',
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      message: 'Enquiry submitted successfully',
      enquiry
    });
  } catch (error) {
    next(error);
  }
};

exports.getEnquiries = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    let query = supabase
      .from('enquiries')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1);

    if (status) {
      query = query.eq('status', status);
    }

    const { data: enquiries, error, count } = await query;

    if (error) throw error;

    res.json({
      enquiries,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getEnquiryById = async (req, res, next) => {
  try {
    const { data: enquiry, error } = await supabase
      .from('enquiries')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error || !enquiry) {
      return res.status(404).json({ error: 'Enquiry not found' });
    }

    res.json(enquiry);
  } catch (error) {
    next(error);
  }
};

exports.updateEnquiry = async (req, res, next) => {
  try {
    const { status, response } = req.body;

    const { data: enquiry, error } = await supabase
      .from('enquiries')
      .update({ status, response, responded_at: new Date().toISOString() })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;
    res.json(enquiry);
  } catch (error) {
    next(error);
  }
};

exports.deleteEnquiry = async (req, res, next) => {
  try {
    const { error } = await supabase
      .from('enquiries')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;
    res.json({ message: 'Enquiry deleted successfully' });
  } catch (error) {
    next(error);
  }
};
