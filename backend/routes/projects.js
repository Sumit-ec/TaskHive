const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const auth = require('../middleware/auth');
const authorize = require('../middleware/role');

router.get('/', auth, async (req, res) => {
    try {
        const Task = require('../models/Task');
        let projects;
        
        if (req.user.role === 'Admin') {
            projects = await Project.find({ admin: req.user.id }).lean();
        } else {
            projects = await Project.find({ members: req.user.id }).populate('admin', 'name email').lean();
        }

        const projectsWithMemberCount = await Promise.all(projects.map(async (project) => {
            const uniqueMembers = await Task.distinct('assignedTo', { 
                project: project._id,
                assignedTo: { $ne: null } 
            });
            return { ...project, memberCount: uniqueMembers.length };
        }));

        res.json(projectsWithMemberCount);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

router.post('/', [auth, authorize('Admin')], async (req, res) => {
    const { name, description, members } = req.body;
    try {
        const newProject = new Project({
            name,
            description,
            admin: req.user.id,
            members
        });
        const project = await newProject.save();
        res.json(project);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

router.put('/:id', [auth, authorize('Admin')], async (req, res) => {
    try {
        let project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ msg: 'Project not found' });
        
        if (project.admin.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        project = await Project.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
        res.json(project);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

router.delete('/:id', [auth, authorize('Admin')], async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ msg: 'Project not found' });
        
        if (project.admin.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        const Task = require('../models/Task');
        await Task.deleteMany({ project: req.params.id });
        await Project.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Project and associated tasks removed' });
    } catch (err) {
        res.status(500).send('Server error');
    }
});

module.exports = router;
