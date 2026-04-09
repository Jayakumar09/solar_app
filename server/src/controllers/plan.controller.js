const supabase = require('../config/supabase');
const { v4: uuidv4 } = require('uuid');

exports.getPlans = async (req, res, next) => {
  try {
    const { data: plans, error } = await supabase
      .from('plans')
      .select('*')
      .eq('is_active', true)
      .order('sort_order');

    if (error) throw error;
    res.json(plans);
  } catch (error) {
    next(error);
  }
};

exports.getPlanById = async (req, res, next) => {
  try {
    const { data: plan, error } = await supabase
      .from('plans')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error || !plan) {
      return res.status(404).json({ error: 'Plan not found' });
    }

    res.json(plan);
  } catch (error) {
    next(error);
  }
};

exports.createPlan = async (req, res, next) => {
  try {
    const {
      name, type, description, features, price,
      capacity, warranty, support, sortOrder
    } = req.body;

    const planId = uuidv4();
    const { data: plan, error } = await supabase
      .from('plans')
      .insert({
        id: planId,
        name,
        type,
        description,
        features,
        price,
        capacity,
        warranty,
        support,
        sort_order: sortOrder || 0,
        is_active: true,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      message: 'Plan created successfully',
      plan
    });
  } catch (error) {
    next(error);
  }
};

exports.updatePlan = async (req, res, next) => {
  try {
    const {
      name, type, description, features, price,
      capacity, warranty, support, sortOrder, isActive
    } = req.body;

    const { data: plan, error } = await supabase
      .from('plans')
      .update({
        name,
        type,
        description,
        features,
        price,
        capacity,
        warranty,
        support,
        sort_order: sortOrder,
        is_active: isActive
      })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;
    res.json(plan);
  } catch (error) {
    next(error);
  }
};

exports.deletePlan = async (req, res, next) => {
  try {
    const { error } = await supabase
      .from('plans')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;
    res.json({ message: 'Plan deleted successfully' });
  } catch (error) {
    next(error);
  }
};
