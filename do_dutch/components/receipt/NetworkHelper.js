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
  { uri: "http://52.12.74.177/assets/groupAvatars/0.jpeg" },
  { uri: "http://52.12.74.177/assets/groupAvatars/1.jpeg" },
  { uri: "http://52.12.74.177/assets/groupAvatars/2.jpeg" },
  { uri: "http://52.12.74.177/assets/groupAvatars/3.jpeg" },
  { uri: "http://52.12.74.177/assets/groupAvatars/4.jpeg" },
  { uri: "http://52.12.74.177/assets/groupAvatars/5.jpeg" },
  { uri: "http://52.12.74.177/assets/groupAvatars/6.jpeg" },
  { uri: "http://52.12.74.177/assets/groupAvatars/7.jpeg" },
  { uri: "http://52.12.74.177/assets/groupAvatars/8.jpeg" },
  { uri: "http://52.12.74.177/assets/groupAvatars/9.jpeg" },
  { uri: "http://52.12.74.177/assets/groupAvatars/10.jpeg" },
  { uri: "http://52.12.74.177/assets/groupAvatars/11.jpeg" }
];

const memberAvatars = [
  { uri: "http://52.12.74.177/assets/memberAvatars/0.jpg" },
  { uri: "http://52.12.74.177/assets/memberAvatars/1.jpg" },
  { uri: "http://52.12.74.177/assets/memberAvatars/2.jpg" },
  { uri: "http://52.12.74.177/assets/memberAvatars/3.jpg" },
  { uri: "http://52.12.74.177/assets/memberAvatars/4.jpg" },
  { uri: "http://52.12.74.177/assets/memberAvatars/5.jpg" }
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
              filename: selection.fileName,
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
      creator: window.user_id,
      payment: "unpaid",
      group: undefined
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
        } else {
          callback([]);
        }
      })
      .catch(error => {});
  },

  pushReceiptData(receipt) {
    if (receipt.group != undefined) {
      receipt.group.members.forEach(member => {
        if (member.member_id != window.user_id) {
          fetch(serverURL + "newReceipt", {
            method: "POST",
            headers: headers,
            body: JSON.stringify({
              sender: window.user_id,
              receiver: member.member_id,
              receiptId: "fakeID",
              data: JSON.stringify(receipt)
            })
          });
        }
      });
    }
  },

  beginPollingReceipt(interval, callback) {
    setInterval(() => {
      if (window.user_id != undefined && window.user_id != "") {
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
      }
    }, interval);
  },

  beginPollingGroupChats(interval, callback) {
    setInterval(() => {
      if (window.group_id_for_chats == undefined) {
        return;
      }

      fetch(serverURL + "getGroupChats", {
        method: "POST",
        headers: headers,
        body: JSON.stringify({
          group_id: window.group_id_for_chats
        })
      })
        .then(response => {
          callback(JSON.parse(response._bodyText));
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
              groups[gIndex].members[mIndex].payment = "unpaid";
            });
          });
          callback(groups);
        }
      })
      .catch(error => {});
  },

  sendPayment(receiver, receiptId) {
    fetch(serverURL + "sendPayment", {
      method: "POST",
      headers: headers,
      body: JSON.stringify({
        sender: window.user_id,
        receiver: receiver,
        receiptId: receiptId
      })
    });
  },

  sendChallenge(receiver, receiptId) {
    fetch(serverURL + "sendChallenge", {
      method: "POST",
      headers: headers,
      body: JSON.stringify({
        sender: window.user_id,
        receiver: receiver,
        receiptId: receiptId
      })
    });
  }
};

export default NetworkHelper;
