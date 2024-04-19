import { Project } from "../../../shared/Types"

const axios = require('axios');
const express = require("express");

require('dotenv').config();
const mafilApiUrl = process.env.MAFIL_API_URL;

export const getProjects = async (req, res) => {
    const projects: Project[] = [
        {uuid: "123", acronym: "Project 1"},
        {uuid: "234", acronym: "Project 2"},
        {uuid: "345", acronym: "Project 3"}
    ];

      
    res.status(200).json(projects);
    // try {
    //     const response = await axios.get(mafilApiUrl + "projects");
    //     const projects = response.data;
    //     res.status(200).json(projects);
    // } catch (error) {
    //     res.status(500).json({ message: "Error fetching projects" });
    // }
}