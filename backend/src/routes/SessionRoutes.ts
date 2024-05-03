import axios from 'axios';
import { Session } from '../../../shared/Types';

require('dotenv').config();
const mafilApiUrl = process.env.MAFIL_API_URL;

export const getSession = async (req, res) => {
    const { study_instance_uuid } = req.params;
    const token = req.headers['token'];

    try {
        const headers = {
            'Authorization': `Bearer ${token}`,
            'StudyInstanceUID': study_instance_uuid
          };
        const response = await axios.get(mafilApiUrl + 'sessions', { headers });
        const sessions: Session[] = response.data.results;
        if (sessions.length == 0) {
            res.status(200).json();
        }
        res.status(200).json(sessions[0]);
    } catch (error) {
        res.status(500).json({ message: "Error fetching sessions" });
    }
}

export const postSession = async (req,res) => {
    const token = req.headers['token'];

    try {
        const headers = {
            'Authorization': `Bearer ${token}`,
          };
        const body = req.body;
        const response = await axios.post(mafilApiUrl + 'sessions', body, { headers });
        res.status(200).json();
    } catch (error) {
        res.status(500).json({ message: "Error posting session" });
    }
}

export const patchSession = async (req,res) => {
    const { session_uuid } = req.params;
    const token = req.headers['token'];

    try {
        const headers = {
            'Authorization': `Bearer ${token}`
          };
        const body = req.body;

        const response = await axios.patch(mafilApiUrl + `sessions/${session_uuid}`, body, { headers });
        res.status(200).json();
    } catch (error) {
        res.status(500).json({ message: "Error patching session" });
    }
}