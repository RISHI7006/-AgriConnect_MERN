const express = require('express');
const router = express.Router();
const { getPriceTrends, getDemandPrediction, getCropRecommendations } = require('../ml/mlService');

// Price Trend Analysis (ML)
router.get('/price-trends', (req, res) => {
  const { crop = 'Tomato', timePeriod = 'Last 6 Months', location = 'All India' } = req.query;
  const data = getPriceTrends(crop, timePeriod, location);
  res.json(data);
});

// Demand Prediction (ML)
router.get('/demand-prediction', (req, res) => {
  const { crop = 'Rice', region = 'All India' } = req.query;
  const data = getDemandPrediction(crop, region);
  res.json(data);
});

// Crop Recommendation (ML)
router.post('/crop-recommendation', (req, res) => {
  const { state = 'Maharashtra', soilType = 'Black Soil', season = 'Kharif' } = req.body;
  const data = getCropRecommendations(state, soilType, season);
  res.json(data);
});

module.exports = router;
