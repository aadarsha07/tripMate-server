// controllers/recommendUserController.js

const User = require('../models/user');
const Destination = require('../models/destination');

const jaccardSimilarity = (set1, set2) => {
  const intersection = new Set([...set1].filter(value => set2.has(value)));
  const union = new Set([...set1, ...set2]);
  
  return intersection.size / union.size;
};

const calculateUserSimilarity = (user1, user2) => {
  const interestsSimilarity = jaccardSimilarity(new Set(user1.interests), new Set(user2.interests));
  const maritalStatusSimilarity = user1.maritalStatus === user2.maritalStatus ? 1 : 0;
  const smokerSimilarity = user1.smoker === user2.smoker ? 1 : 0;
  const drinkerSimilarity = user1.drinker === user2.drinker ? 1 : 0;
  const qualificationSimilarity = user1.qualification === user2.qualification ? 1 : 0;
  const languagesSimilarity = jaccardSimilarity(new Set(user1.languages), new Set(user2.languages));
  const citySimilarity = user1.city === user2.city ? 1 : 0;
  const ageSimilarity = Math.abs(user1.dateOfBirth - user2.dateOfBirth) <= 63072000000 ? 1 : 0;
  const genderSimilarity = user1.gender !== user2.gender ? user1.lookingFor === user2.lookingFor ? 1 : 0 : 0;

  const similarity = interestsSimilarity * 0.5 + maritalStatusSimilarity * 0.2 + smokerSimilarity * 0.1 + drinkerSimilarity * 0.1 + qualificationSimilarity * 0.2 + languagesSimilarity * 0.3 + citySimilarity * 0.1 + ageSimilarity * 0.3 + genderSimilarity * 0.5; 

  return similarity;
};

const findSimilarUsers = async (userId) => {
  const user = await User.findById(userId);
  const allUsers = await User.find();

  const similarUsers = allUsers
    .filter((otherUser) => otherUser.id !== userId)
    .map((otherUser) => ({
      user: otherUser,
      similarity: calculateUserSimilarity(user, otherUser),
    }))
    .filter((user) => user.similarity !== null) 
    .sort((a, b) => b.similarity - a.similarity);

  return similarUsers;
};

const getRecommendedUsersWithDestinations = async (req, res) => {
  try {
    const userId = req.params.userId;
    const recommendedUsers = await findSimilarUsers(userId);
    
    // Fetch destinations for recommended users
    const recommendedUserIds = recommendedUsers.map(user => user.user._id);
    const recommendedUsersWithDestinations = [];

    for (const userId of recommendedUserIds) {
      const destinations = await Destination.find({ 'addedBy.userId': userId });
      
      // Add user with destinations to the array
      recommendedUsersWithDestinations.push({
        // user: recommendedUsers.find(user => user.user._id.toString() === userId.toString()).user,
        similarity: recommendedUsers.find(user => user.user._id.toString() === userId.toString()).similarity,
        destinations: destinations,
      });
    }

    res.json({ recommendedUsersWithDestinations });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  getRecommendedUsersWithDestinations,
};
