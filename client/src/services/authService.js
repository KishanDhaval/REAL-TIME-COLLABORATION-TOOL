import axiosInstance from "../utils/axiosConfig";

// Function to update user profile details
export const updateProfile = async (name, userName, about) => {
  const res = await axiosInstance.put('/api/auth/update-profile', { name, userName, about });
  return res?.data;
};

// Function to update user profile photo
export const updatePhoto = async (photo) => {
  const formData = new FormData();
  formData.append('photo', photo);

  const res = await axiosInstance.put('/api/auth/update-photo', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res?.data;
};


export const getSavedElements = async () => {
  const res = await axiosInstance.get('/api/auth/saved-submissions');
  return res?.data;
};


export const getAllUsers = async () => {
  const res = await axiosInstance.get('/api/auth/users');
  return res?.data;
};
