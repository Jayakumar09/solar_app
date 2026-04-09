const supabase = require('../config/supabase');
const { v4: uuidv4 } = require('uuid');

exports.getAllUsers = async (req, res, next) => {
  try {
    const { data: users, error } = await supabase
      .from('users')
      .select('id, email, name, phone, role, created_at, last_login')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(users);
  } catch (error) {
    next(error);
  }
};

exports.getUserById = async (req, res, next) => {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, name, phone, role, created_at, last_login')
      .eq('id', req.params.id)
      .single();

    if (error || !user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const { name, phone } = req.body;

    const { data: user, error } = await supabase
      .from('users')
      .update({ name, phone })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;
    res.json(user);
  } catch (error) {
    next(error);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    next(error);
  }
};

exports.getCustomers = async (req, res, next) => {
  try {
    const { data: customers, error } = await supabase
      .from('users')
      .select('*, customer_profiles(*)')
      .eq('role', 'customer')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(customers);
  } catch (error) {
    next(error);
  }
};
