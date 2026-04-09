const supabase = require('../config/supabase');

exports.getProfile = async (req, res, next) => {
  try {
    const { data: profile, error } = await supabase
      .from('customer_profiles')
      .select('*')
      .eq('user_id', req.user.id)
      .single();

    if (error && error.code !== 'PGRST116') {
      return res.status(404).json({ error: 'Profile not found' });
    }

    const { data: user } = await supabase
      .from('users')
      .select('email, name, phone, role')
      .eq('id', req.user.id)
      .single();

    res.json({
      ...profile,
      ...user
    });
  } catch (error) {
    next(error);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const {
      fullName, phone, address, city, state,
      pincode, aadhaar, gstin, occupation, companyName
    } = req.body;

    const { data: existing } = await supabase
      .from('customer_profiles')
      .select('id')
      .eq('user_id', req.user.id)
      .single();

    if (existing) {
      const { data: profile, error } = await supabase
        .from('customer_profiles')
        .update({
          full_name: fullName,
          phone,
          address,
          city,
          state,
          pincode,
          aadhaar,
          gstin,
          occupation,
          company_name: companyName
        })
        .eq('user_id', req.user.id)
        .select()
        .single();

      if (error) throw error;

      await supabase
        .from('users')
        .update({ name: fullName, phone })
        .eq('id', req.user.id);

      res.json(profile);
    } else {
      const { data: profile, error } = await supabase
        .from('customer_profiles')
        .insert({
          user_id: req.user.id,
          full_name: fullName,
          phone,
          address,
          city,
          state,
          pincode,
          aadhaar,
          gstin,
          occupation,
          company_name: companyName
        })
        .select()
        .single();

      if (error) throw error;
      res.json(profile);
    }
  } catch (error) {
    next(error);
  }
};

exports.uploadDocument = async (req, res, next) => {
  try {
    const { documentType, documentUrl } = req.body;

    const { data: doc, error } = await supabase
      .from('customer_documents')
      .insert({
        customer_id: req.user.id,
        document_type: documentType,
        document_url: documentUrl,
        uploaded_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    res.json(doc);
  } catch (error) {
    next(error);
  }
};
