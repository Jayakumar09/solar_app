const supabase = require('../config/supabase');

exports.getStats = async (req, res, next) => {
  try {
    const [
      { count: totalLeads },
      { count: totalCustomers },
      { count: totalBookings },
      { count: totalEnquiries }
    ] = await Promise.all([
      supabase.from('leads').select('*', { count: 'exact', head: true }),
      supabase.from('users').select('*', { count: 'exact', head: true }).eq('role', 'customer'),
      supabase.from('bookings').select('*', { count: 'exact', head: true }),
      supabase.from('enquiries').select('*', { count: 'exact', head: true })
    ]);

    const { data: recentLeads } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);

    const { data: recentBookings } = await supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);

    const { data: quotes } = await supabase
      .from('quotes')
      .select('estimated_amount')
      .order('created_at', { ascending: false })
      .limit(30);

    const totalRevenue = quotes?.reduce((sum, q) => sum + (q.estimated_amount || 0), 0) || 0;

    res.json({
      stats: {
        totalLeads,
        totalCustomers,
        totalBookings,
        totalEnquiries,
        totalRevenue
      },
      recentLeads,
      recentBookings
    });
  } catch (error) {
    next(error);
  }
};

exports.getLeadsByStatus = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('leads')
      .select('status, count')
      .order('status');

    if (error) throw error;
    res.json(data);
  } catch (error) {
    next(error);
  }
};

exports.getMonthlyStats = async (req, res, next) => {
  try {
    const { data: leads } = await supabase
      .from('leads')
      .select('created_at')
      .gte('created_at', new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString());

    const monthlyData = {};
    leads?.forEach(lead => {
      const month = lead.created_at.substring(0, 7);
      monthlyData[month] = (monthlyData[month] || 0) + 1;
    });

    const result = Object.entries(monthlyData).map(([month, count]) => ({
      month,
      count
    })).sort((a, b) => a.month.localeCompare(b.month));

    res.json(result);
  } catch (error) {
    next(error);
  }
};
