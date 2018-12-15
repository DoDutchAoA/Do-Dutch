import ImagePicker from "react-native-image-picker";
import RNFetchBlob from "react-native-fetch-blob";

const serverURL = "http://52.12.74.177:5000/";
const headers = {
  Accept: "application/json",
  "Content-Type": "application/json"
};
const options = {
  title: "New Receipt",
  takePhotoButtonTitle: "Take a photo",
  chooseFromLibraryButtonTitle: "Choose from gallery",
  quality: 1
};

const groupAvatars = [
  require("./assets/groupAvatars/0.jpeg"),
  require("./assets/groupAvatars/1.jpeg"),
  require("./assets/groupAvatars/2.jpeg"),
  require("./assets/groupAvatars/3.jpeg"),
  require("./assets/groupAvatars/4.jpeg"),
  require("./assets/groupAvatars/5.jpeg"),
  require("./assets/groupAvatars/6.jpeg"),
  require("./assets/groupAvatars/7.jpeg"),
  require("./assets/groupAvatars/8.jpeg"),
  require("./assets/groupAvatars/9.jpeg"),
  require("./assets/groupAvatars/10.jpeg"),
  require("./assets/groupAvatars/11.jpeg")
];

const memberAvatars = [
  require("./assets/memberAvatars/0.jpg"),
  require("./assets/memberAvatars/1.jpg"),
  require("./assets/memberAvatars/2.jpg"),
  require("./assets/memberAvatars/3.jpg"),
  require("./assets/memberAvatars/4.jpg"),
  require("./assets/memberAvatars/5.jpg")
];

let NetworkHelper = {
  uploadReceiptPhoto(loadedCallback, uploadedCallback) {
    ImagePicker.showImagePicker(options, selection => {
      if (selection.didCancel) {
      } else if (selection.error) {
      } else {
        let source = { uri: selection.uri };
        loadedCallback(source, selection.data, true);
        RNFetchBlob.fetch(
          "POST",
          serverURL + "upload",
          {
            "Content-Type": "multipart/form-data"
          },
          [
            {
              name: "image",
              filename: window.user_id + "image.png",
              type: "image/png",
              data: selection.data
            }
          ]
        )
          .then(response => {
            uploadedCallback(this.parseReceiptPackage(response.data));
          })
          .catch(err => {
            console.error("Error: " + err);
          });
      }
    });
  },

  parseReceiptPackage(data) {
    let parsedData = JSON.parse(data);
    let goods = parsedData.items;
    for (let i = 0; i < goods.length; i++) {
      goods[i]["icon"] = "file";
      goods[i]["name"] = goods[i]["display"];
      goods[i]["price"] = goods[i]["price"];
      goods[i]["split"] = true;
    }
    let accumTotal = parsedData.accumTotal;
    let detectedTotal = parsedData.detectedTotal;

    let time = new Date();
    let parsedTime = time.toString().split(" ");
    let timeStamp =
      parsedTime[1] +
      " " +
      parsedTime[2] +
      " " +
      time.getHours() +
      ":" +
      time.getMinutes();

    return {
      receiptId: window.user_id.toString() + time.getTime(),
      title: "Receipt Name",
      time: timeStamp,
      place: "Walmart",
      items: goods,
      accumTotal: "$" + accumTotal.toFixed(2).toString(),
      detectedTotal: "$" + detectedTotal.toFixed(2).toString(),
      image_url: parsedData.path,
      creator: window.user_id
    };
  },

  saveToCloud(userId, receipts) {
    fetch(serverURL + "updateUserReceipts", {
      method: "POST",
      headers: headers,
      body: JSON.stringify({
        user_id: userId,
        info: JSON.stringify(receipts)
      })
    });
  },

  loadFromCloud(userId, callback) {
    fetch(serverURL + "getUserReceipts", {
      method: "POST",
      headers: headers,
      body: JSON.stringify({
        user_id: userId
      })
    })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson) {
          callback(JSON.parse(responseJson["info"]));
        }
      })
      .catch(error => {});
  },

  pushReceiptData(receipt) {
    if (receipt.group != undefined) {
      receipt.group.members.forEach(member => {
        fetch(serverURL + "newReceipt", {
          method: "POST",
          headers: headers,
          body: JSON.stringify({
            sender: window.user_id,
            receiver: member.member_id,
            receiptId: "someid",
            data: JSON.stringify(receipt)
          })
        });
      });
    }
  },

  beginPollingReceipt(interval, callback) {
    setInterval(() => {
      fetch(serverURL + "pollingReceipt", {
        method: "POST",
        headers: headers,
        body: JSON.stringify({
          receiver: window.user_id
        })
      })
        .then(response => response.json())
        .then(responseJson => {
          callback(responseJson);
        })
        .catch(error => {});
    }, interval);
  },

  loadAllGroups(userId, callback) {
    fetch(serverURL + "getAllGroups", {
      method: "POST",
      headers: headers,
      body: JSON.stringify({
        user_id: userId
      })
    })
      .then(response => response.json())
      .then(groups => {
        if (groups != undefined) {
          groups.forEach((group, gIndex) => {
            groups[gIndex].avatar = groupAvatars[parseInt(group.group_id) % 12];
            group.members.forEach((member, mIndex) => {
              groups[gIndex].members[mIndex].avatar =
                memberAvatars[parseInt(member.member_id) % 6];
              groups[gIndex].members[mIndex].paid = false;
            });
          });
          callback(groups);
        }
      })
      .catch(error => {});
  }
};

export default NetworkHelper;
