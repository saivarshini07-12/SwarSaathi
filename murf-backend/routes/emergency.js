const express = require('express');
const { runQuery, getQuery, allQuery } = require('../database');
const { authenticateToken } = require('../auth');

const router = express.Router();

// Get all emergency contacts for a user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const contacts = await allQuery(
      'SELECT * FROM emergency_contacts WHERE user_id = ? ORDER BY is_primary DESC, created_at DESC',
      [req.user.id]
    );

    const formattedContacts = contacts.map(contact => ({
      ...contact,
      is_primary: Boolean(contact.is_primary)
    }));

    res.json({ contacts: formattedContacts });
  } catch (error) {
    console.error('Get emergency contacts error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add a new emergency contact
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { name, phone, relationship, is_primary } = req.body;

    if (!name || !phone || !relationship) {
      return res.status(400).json({ 
        error: 'Name, phone, and relationship are required' 
      });
    }

    // If this is set as primary, remove primary status from other contacts
    if (is_primary) {
      await runQuery(
        'UPDATE emergency_contacts SET is_primary = 0 WHERE user_id = ?',
        [req.user.id]
      );
    }

    const result = await runQuery(
      'INSERT INTO emergency_contacts (user_id, name, phone, relationship, is_primary) VALUES (?, ?, ?, ?, ?)',
      [req.user.id, name, phone, relationship, is_primary || false]
    );

    const newContact = await getQuery(
      'SELECT * FROM emergency_contacts WHERE id = ?',
      [result.id]
    );

    res.status(201).json({
      message: 'Emergency contact added successfully',
      contact: {
        ...newContact,
        is_primary: Boolean(newContact.is_primary)
      }
    });
  } catch (error) {
    console.error('Add emergency contact error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update an emergency contact
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone, relationship, is_primary } = req.body;

    // Check if contact belongs to user
    const contact = await getQuery(
      'SELECT * FROM emergency_contacts WHERE id = ? AND user_id = ?',
      [id, req.user.id]
    );

    if (!contact) {
      return res.status(404).json({ error: 'Emergency contact not found' });
    }

    // If this is set as primary, remove primary status from other contacts
    if (is_primary && !contact.is_primary) {
      await runQuery(
        'UPDATE emergency_contacts SET is_primary = 0 WHERE user_id = ? AND id != ?',
        [req.user.id, id]
      );
    }

    await runQuery(
      `UPDATE emergency_contacts 
       SET name = ?, phone = ?, relationship = ?, is_primary = ?, updated_at = CURRENT_TIMESTAMP 
       WHERE id = ? AND user_id = ?`,
      [
        name || contact.name,
        phone || contact.phone,
        relationship || contact.relationship,
        is_primary !== undefined ? is_primary : contact.is_primary,
        id,
        req.user.id
      ]
    );

    const updatedContact = await getQuery(
      'SELECT * FROM emergency_contacts WHERE id = ?',
      [id]
    );

    res.json({
      message: 'Emergency contact updated successfully',
      contact: {
        ...updatedContact,
        is_primary: Boolean(updatedContact.is_primary)
      }
    });
  } catch (error) {
    console.error('Update emergency contact error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete an emergency contact
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await runQuery(
      'DELETE FROM emergency_contacts WHERE id = ? AND user_id = ?',
      [id, req.user.id]
    );

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Emergency contact not found' });
    }

    res.json({ message: 'Emergency contact deleted successfully' });
  } catch (error) {
    console.error('Delete emergency contact error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Set primary contact
router.patch('/:id/primary', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if contact belongs to user
    const contact = await getQuery(
      'SELECT * FROM emergency_contacts WHERE id = ? AND user_id = ?',
      [id, req.user.id]
    );

    if (!contact) {
      return res.status(404).json({ error: 'Emergency contact not found' });
    }

    // Remove primary status from all contacts
    await runQuery(
      'UPDATE emergency_contacts SET is_primary = 0 WHERE user_id = ?',
      [req.user.id]
    );

    // Set this contact as primary
    await runQuery(
      'UPDATE emergency_contacts SET is_primary = 1, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ?',
      [id, req.user.id]
    );

    res.json({ 
      message: 'Primary contact updated successfully'
    });
  } catch (error) {
    console.error('Set primary contact error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get primary contact
router.get('/primary', authenticateToken, async (req, res) => {
  try {
    const primaryContact = await getQuery(
      'SELECT * FROM emergency_contacts WHERE user_id = ? AND is_primary = 1',
      [req.user.id]
    );

    if (!primaryContact) {
      return res.status(404).json({ error: 'No primary contact found' });
    }

    res.json({ 
      contact: {
        ...primaryContact,
        is_primary: Boolean(primaryContact.is_primary)
      }
    });
  } catch (error) {
    console.error('Get primary contact error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
