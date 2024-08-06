"use client";
import { useState, useEffect } from "react";
import { firestore } from "@/firebase";
import { Box, Typography, Modal, Stack, TextField, Button, IconButton } from "@mui/material";
import { collection, query, getDocs, getDoc, setDoc, deleteDoc, doc } from 'firebase/firestore';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [updateMode, setUpdateMode] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      });
    });
    setInventory(inventoryList);
  };

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
    } else {
      await setDoc(docRef, { quantity: 1 });
    }

    await updateInventory();
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      await deleteDoc(docRef);
    }
    await updateInventory();
  };

  const updateItem = async (item, newItemName) => {
    if (newItemName.trim()) {
      const docRef = doc(collection(firestore, 'inventory'), item);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        await deleteDoc(docRef);
        await setDoc(doc(collection(firestore, 'inventory'), newItemName), docSnap.data());
      }
      await updateInventory();
    }
  };

  useEffect(() => {
    updateInventory();
  }, []);

  const handleOpen = () => {
    setItemName('');
    setUpdateMode(false);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleAddItem = () => {
    if (itemName.trim()) {
      addItem(itemName);
      setItemName('');
      handleClose();
    }
  };

  const handleUpdateItem = () => {
    if (itemName.trim() && currentItem) {
      updateItem(currentItem, itemName);
      setItemName('');
      setCurrentItem(null);
      handleClose();
    }
  };

  const handleEditItem = (item) => {
    setItemName(item);
    setCurrentItem(item);
    setUpdateMode(true);
    setOpen(true);
  };

  return (
    <Box width="100vw" height="100vh" display="flex" flexDirection="column" justifyContent="center" alignItems="center" gap={2}>
      <Modal open={open} onClose={handleClose}>
        <Box position="absolute" top="50%" left="50%" width={400} bgcolor="white" border="2px solid black" boxShadow={24} p={4} display="flex" flexDirection="column" gap={3} sx={{ transform: "translate(-50%,-50%)" }}>
          <Typography variant="h6">{updateMode ? 'Update Item' : 'Add Item'}</Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField label="Item Name" value={itemName} onChange={(e) => setItemName(e.target.value)} fullWidth />
          </Stack>
          <Button variant="contained" color="primary" onClick={updateMode ? handleUpdateItem : handleAddItem}>
            {updateMode ? 'Update' : 'Add'}
          </Button>
        </Box>
      </Modal>
      <Typography variant="h1">Inventory Management</Typography>
      <Button variant="contained" color="primary" onClick={handleOpen}>Add New Item</Button>
      <Box width="80%" mt={4}>
        {inventory.map((item) => (
          <Box key={item.name} display="flex" justifyContent="space-between" alignItems="center" p={2} border="1px solid black" borderRadius="8px" mb={2}>
            <Typography variant="body1">{item.name} (Quantity: {item.quantity})</Typography>
            <Box>
              <IconButton onClick={() => handleEditItem(item.name)}>
                <EditIcon />
              </IconButton>
              <IconButton onClick={() => removeItem(item.name)}>
                <DeleteIcon />
              </IconButton>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
