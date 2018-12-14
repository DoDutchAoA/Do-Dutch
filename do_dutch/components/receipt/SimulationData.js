export const receiptData = [
  { name: "pizza", icon: "file" },
  { name: "apple", icon: "file" }
];

export const friendsData1 = [
  {
    name: "Sharer",
    avatar: 1,
    selected: false
  },
  {
    name: "Chris Jackson",
    avatar: 2,
    selected: false
  },
  {
    name: "Amy Farha",
    avatar: 3,
    selected: false
  },
  {
    name: "Chris Jackson",
    avatar: 4,
    selected: false
  }
];

export const friendsData2 = [
  {
    name: "Amy Farha",
    avatar: "https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg",
    selected: false
  },
  {
    name: "Chris Jackson",
    avatar: "https://s3.amazonaws.com/uifaces/faces/twitter/kfriedson/128.jpg",
    selected: false
  },
  {
    name: "Amy Farha",
    avatar: "https://s3.amazonaws.com/uifaces/faces/twitter/brynn/128.jpg",
    selected: false
  },
  {
    name: "Chris Jackson",
    avatar:
      "https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg",
    selected: false
  }
];

export const receiptHistory = [
  {
    title: "Receipt 1",
    time: "DEC 1",
    place: "HMart",
    image_url: "https://i.imgur.com/UYiroysl.jpg",
    status: "Pending",
    items: [
      {
        icon: "file",
        name: "display",
        price: 8.0,
        split: true
      },
      {
        icon: "file",
        name: "display",
        price: 5.0,
        split: true
      }
    ],
    accumTotal: 0.0,
    detectedTotal: 0.0,
    friends: friendsData1
  },
  {
    title: "Receipt 2",
    time: "NOV 30",
    place: "ACME",
    image_url: "https://i.imgur.com/UPrs1EWl.jpg",
    status: "Pending",
    items: [
      {
        icon: "file",
        name: "display",
        price: 8.0,
        split: true
      },
      {
        icon: "file",
        name: "display",
        price: 5.0,
        split: true
      }
    ],
    accumTotal: 10.55,
    detectedTotal: 10.67,
    friends: friendsData2
  },
  {
    title: "Receipt 3",
    time: "NOV 25",
    place: "Walmart",
    image_url: "https://i.imgur.com/MABUbpDl.jpg",
    status: "Pending",
    items: [],
    accumTotal: 10.55,
    detectedTotal: 10.67
  }
];
