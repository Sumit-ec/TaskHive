const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const Project = require('../models/Project');
const auth = require('../middleware/auth');
const authorize = require('../middleware/role');

router.get('/', auth, async (req, res) => {
    try {
        let tasks;
        if (req.user.role === 'Admin') {
            const adminProjects = await Project.find({ admin: req.user.id }).select('_id');
            const adminProjectIds = adminProjects.map(p => p._id);
            tasks = await Task.find({ project: { $in: adminProjectIds } })
                .populate('assignedTo', 'name email')
                .populate('project', 'name');
        } else {
            tasks = await Task.find({ assignedTo: req.user.id }).populate('project', 'name');
        }
        res.json(tasks);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

router.get('/project/:projectId', auth, async (req, res) => {
    try {
        const project = await Project.findById(req.params.projectId);
        if (!project) return res.status(404).json({ msg: 'Project not found' });

        if (req.user.role === 'Admin' && project.admin.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        const tasks = await Task.find({ project: req.params.projectId }).populate('assignedTo', 'name email');
        res.json(tasks);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

router.post('/', [auth, authorize('Admin')], async (req, res) => {
    let { title, description, project, assignedTo, priority, dueDate } = req.body;
    if (assignedTo === '') assignedTo = null;
    try {
        const projectDoc = await Project.findById(project);
        if (!projectDoc) return res.status(404).json({ msg: 'Project not found' });
        if (projectDoc.admin.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized to create tasks in this project' });
        }

        const newTask = new Task({
            title,
            description,
            project,
            assignedTo,
            priority,
            dueDate
        });
        const task = await newTask.save();

        if (assignedTo) {
            await Project.findByIdAndUpdate(project, {
                $addToSet: { members: assignedTo }
            });
        }

        res.json(task);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

router.put('/:id', auth, async (req, res) => {
    let updateData = { ...req.body };
    if (updateData.assignedTo === '') updateData.assignedTo = null;
    
    try {
        let task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ msg: 'Task not found' });

        if (req.user.role === 'Admin') {
            const project = await Project.findById(task.project);
            if (!project || project.admin.toString() !== req.user.id) {
                return res.status(401).json({ msg: 'Not authorized' });
            }
        } else {
            if (!task.assignedTo || task.assignedTo.toString() !== req.user.id) {
                return res.status(401).json({ msg: 'Not authorized' });
            }
        }

        task = await Task.findByIdAndUpdate(req.params.id, { $set: updateData }, { new: true });

        if (task.project && task.assignedTo) {
            await Project.findByIdAndUpdate(task.project, {
                $addToSet: { members: task.assignedTo }
            });
        }

        return res.json(task);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

router.get('/stats', auth, async (req, res) => {
    try {
        let filter = {};
        if (req.user.role === 'Admin') {
            const adminProjects = await Project.find({ admin: req.user.id }).select('_id');
            const adminProjectIds = adminProjects.map(p => p._id);
            filter.project = { $in: adminProjectIds };
        } else {
            filter.assignedTo = req.user.id;
        }

        const statsArray = await Task.aggregate([
            { $match: filter },
            { $group: { _id: '$status', count: { $sum: 1 } } }
        ]);

        const stats = {
            'To Do': 0,
            'In Progress': 0,
            'Done': 0,
            'Review': 0
        };

        statsArray.forEach(item => {
            if (stats.hasOwnProperty(item._id)) {
                stats[item._id] = item.count;
            }
        });

        res.json(stats);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

module.exports = router;
