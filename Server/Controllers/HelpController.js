import Help from "../Models/HelpSchema.js";

export const createHelpRequest = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!subject || !message) {
      return res
        .status(400)
        .json({ error: "Subject and message are required." });
    }
    const newHelpRequest = new Help({
      name,
      email,
      subject,
      message,
    });
    await newHelpRequest.save();
    res.status(201).json({ message: "Help request created successfully." });
  } catch (error) {
    res.status(500).json({ error: "Failed to create help request." });
  }
};

export const getHelpRequests = async (req, res) => {
  try {
    const helpRequests = await Help.find().sort({ createdAt: -1 });
    res.status(200).json(helpRequests);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve help requests." });
  }
};

export const getOnlyOneHelpRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const helpRequest = await Help.findById(id);
    if (!helpRequest) {
      return res.status(404).json({ error: "Help request not found." });
    }
    res.status(200).json(helpRequest);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve help request." });
  }
};

export const deleteHelpRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const helpRequest = await Help.findByIdAndDelete(id);
    if (!helpRequest) {
      return res.status(404).json({ error: "Help request not found." });
    }
    res.status(200).json({ message: "Help request deleted successfully." });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete help request." });
  }
};
