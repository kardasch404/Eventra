const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/eventra-dev').then(async () => {
  const E = mongoose.model('Event', new mongoose.Schema({}, {strict: false}));
  const t = await E.countDocuments({status: 'PUBLISHED'});
  console.log('Total:', t);
  const events = await E.find({status: 'PUBLISHED'}).select('title location.city category').limit(5);
  events.forEach(e => console.log(e.title, '-', e.location?.city, '-', e.category));
  mongoose.connection.close();
  process.exit(0);
});
