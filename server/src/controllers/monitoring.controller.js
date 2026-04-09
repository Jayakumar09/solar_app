const supabase = require('../config/supabase');

exports.getMonitoringData = async (req, res, next) => {
  try {
    const { customerId, period = '7d' } = req.query;
    const targetId = customerId || req.user.id;

    let days = 7;
    if (period === '30d') days = 30;
    if (period === '90d') days = 90;

    const { data: readings, error } = await supabase
      .from('energy_readings')
      .select('*')
      .eq('customer_id', targetId)
      .gte('reading_time', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString())
      .order('reading_time', { ascending: true });

    if (error) throw error;

    const { data: installation } = await supabase
      .from('installations')
      .select('*, plans(*)')
      .eq('customer_id', targetId)
      .single();

    const totalGeneration = readings?.reduce((sum, r) => sum + (r.energy_generated || 0), 0) || 0;
    const totalConsumption = readings?.reduce((sum, r) => sum + (r.energy_consumed || 0), 0) || 0;

    res.json({
      readings,
      installation,
      summary: {
        totalGeneration,
        totalConsumption,
        netEnergy: totalGeneration - totalConsumption,
        avgDailyGeneration: totalGeneration / days,
        period
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getLiveData = async (req, res, next) => {
  try {
    const { customerId } = req.query;
    const targetId = customerId || req.user.id;

    const { data: latestReading } = await supabase
      .from('energy_readings')
      .select('*')
      .eq('customer_id', targetId)
      .order('reading_time', { ascending: false })
      .limit(1)
      .single();

    res.json({
      currentPower: latestReading?.current_power || 0,
      todayGeneration: latestReading?.today_generation || 0,
      todayConsumption: latestReading?.today_consumption || 0,
      gridStatus: latestReading?.grid_status || 'connected',
      batteryLevel: latestReading?.battery_level || 0,
      lastUpdated: latestReading?.reading_time
    });
  } catch (error) {
    next(error);
  }
};

exports.getHistoricalData = async (req, res, next) => {
  try {
    const { customerId, startDate, endDate } = req.query;
    const targetId = customerId || req.user.id;

    let query = supabase
      .from('energy_readings')
      .select('*')
      .eq('customer_id', targetId)
      .order('reading_time', { ascending: true });

    if (startDate) {
      query = query.gte('reading_time', startDate);
    }
    if (endDate) {
      query = query.lte('reading_time', endDate);
    }

    const { data: readings, error } = await query;

    if (error) throw error;
    res.json(readings);
  } catch (error) {
    next(error);
  }
};
