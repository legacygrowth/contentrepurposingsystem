const instagramService = require("../services/instagramService")


exports.postTextOnInstagram = async (req, res) => { 
    const { message } = req.body;

    try {
        if (!message || typeof message !== 'string') {
            return res.status(400).json({ error: 'Invalid message format' });
        }
        const postId = await instagramService.postTextOnInstagram(message);
        res.json({ success: true, postId });
    } catch (error) {
        console.error('Error posting text on Instagram:', error);
        res.status(500).json({ error: 'Failed to post text on Instagram' });
    }
};

exports.postImageFromURLOnInstagram = async (req, res) => {
    const { message, imageUrl } = req.body;

    try {
        if (!message || typeof message !== 'string' || !imageUrl || typeof imageUrl !== 'string') {
            return res.status(400).json({ error: 'Invalid message or image URL format' });
        }
        const postId = await instagramService.postImageFromURLOnInstagram(message, imageUrl);
        res.json({ success: true, postId });
    } catch (error) {
        console.error('Error posting image from URL on Instagram:', error);
        res.status(500).json({ error: 'Failed to post image from URL on Instagram' });
    }
};

exports.postImageFromFileOnInstagram = async (req, res) => {
    const { message } = req.body;
    const imageFile = req.file; // Assuming you're using multer for file uploads

    if (!imageFile) {
        return res.status(400).json({ error: 'No image file provided' });
    }

    try {
        const postId = await instagramService.postImageFromFileOnInstagram(message, imageFile);
        res.json({ success: true, postId });
    } catch (error) {
        console.error('Error posting image from file on Instagram:', error);
        res.status(500).json({ error: 'Failed to post image from file on Instagram' });
    }
};

exports.postVideoOnInstagram = async (req, res) => {
    const { message } = req.body;
    const videoFile = req.file; // Assuming you're using multer for file uploads

    if (!videoFile) {
        return res.status(400).json({ error: 'No video file provided' });
    }

    try {
        const postId = await instagramService.postVideoOnInstagram(message, videoFile);
        res.json({ success: true, postId });
    } catch (error) {
        console.error('Error posting video on Instagram:', error);
        res.status(500).json({ error: 'Failed to post video on Instagram' });
    }
};