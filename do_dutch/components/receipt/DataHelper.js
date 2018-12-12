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
    if (data === null) data = [];
    callback(data);
    console.log("yes");
  }
};

export default DataHelper;
