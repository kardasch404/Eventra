const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/eventra-dev').then(async () => {
  const User = mongoose.model('User', new mongoose.Schema({}, {strict: false}));
  const users = await User.find({}).select('email firstName lastName roles');
  console.log('Users:', users.length);
  users.forEach(u => console.log('-', u.email, u.roles));
  mongoose.connection.close();
  process.exit(0);
});
