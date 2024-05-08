const axios = require('axios');

require('dotenv').config();
const mafilApiUrl = process.env.MAFIL_API_URL;

export const getProjects = async (req, res) => {

  const token = req.headers['token'];

  try {
    const headers = {
      'Authorization': `Bearer ${token}`
    };
    const response = await axios.get(mafilApiUrl + 'projects', {headers});
    const projects = response.data;
    res.status(200).json(projects.results);
  } catch (error) {
    res.status(500).json({message: 'Error fetching projects'});
  }
}