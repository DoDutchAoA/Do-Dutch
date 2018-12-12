import { AsyncStorage } from "react-native";

let DataHelper = {
  saveToLocal: async (key, value) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      // Error saving data
    }
  },

  getFromLocal: async (key, callback) => {
    let data = await AsyncStorage.getItem(key);
    callback(data);
  }
};

export default DataHelper;
