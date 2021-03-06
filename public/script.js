//------------------------firebase----------------------------------------
const firebaseConfig = {
  apiKey: "AIzaSyBntUepSNXM7FhJBHUyisYBcJi7vqni54M",
  authDomain: "socialarpublic1.firebaseapp.com",
  databaseURL:
    "https://socialarpublic1-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "socialarpublic1",
  storageBucket: "socialarpublic1.appspot.com",
  messagingSenderId: "591109157331",
  appId: "1:591109157331:web:df39e29f2dd19f07b47f26",
  measurementId: "G-W244638TZL",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
var storage = firebase.app().storage("gs://socialarpublic1.appspot.com");
var database = firebase.database();
var modelRef = firebase.database().ref("/titech");

// -------main------------------------
window.addEventListener("load", () => {
  modelRef.on("value", (snapshot) => {
    const data = snapshot.val();
    console.dir(data);
    renderPlaces(data);
  });
});

// AFRAME.registerComponent("updatedistance", {
//   schema: {},
//   update: function (olddata) {
//     let dm = this.el.getAttribute("distance");
//     console.log(dm);
//     this.el.setAttribute("value", `${dm}m`);
//   },
// });

AFRAME.registerComponent("cursor-listener", {
  schema: {
    value: { type: "string" },
  },
  init: function () {
    console.log(this.data.value);
    var value = this.data.value;
    this.el.addEventListener("click", function (evt) {
      console.log("clicked!!!!!");
      console.log(value);
      document.getElementById("caption").innerHTML = value;
    });
  },
});

let upDateDistance = () => {
  let distances = document.querySelectorAll(".distance");
  distances.forEach((distance) => {
    let dm = parseInt(distance.getAttribute("distance"));
    if (dm) {
      distance.setAttribute("value", `${dm}m`);
    }
  });
};

setInterval(upDateDistance, 5000);

//----------render-----------------------------------------
function renderPlaces(Models) {
  let scene = document.querySelector("a-scene");
  console.log(Models);
  for (const Id in Models) {
    let Model = Models[Id];
    console.log(Model);
    let id = Id;
    let name = Model.name;
    let latitude = Model.location.latitude;
    let longitude = Model.location.longitude;
    let height = parseFloat(Model.location.height);
    let modelname = Model.model;
    let caption = Model.caption;
    let labelEnable = Model.label;
    let minDistance = Model.minDistance;
    let maxDistance = Model.maxDistance;
    let distanceEnable = Model.distance;
    let link = Model.link;
    const scale = 50;
    // let scale = building.scale;

    if (document.getElementById(id)) {
      //------------------3D??????????????????--------------------------------
      let entity = document.getElementById(id);
      entity.setAttribute(
        "gps-projected-entity-place",
        `latitude: ${latitude}; longitude: ${longitude};`
      );
      entity.setAttribute("position", { x: 0, y: height, z: 0 });
      entity.setAttribute("animation-mixer", "");
      if (link) {
        entity.setAttribute("link", `href:${link}`);
      }
      if (caption) {
        entity.setAttribute("cursor-listener", { value: caption });
      }
      //------------------??????--------------------------------
      if (labelEnable) {
        if (document.getElementById(`discription${id}`)) {
          var discription = document.getElementById(`discription${id}`);
        } else {
          var discription = document.createElement("a-text");
          discription.setAttribute("id", `discription${id}`);
        }
        discription.setAttribute(
          "gps-projected-entity-place",
          `latitude: ${latitude}; longitude: ${longitude};`
        );
        discription.setAttribute("position", { x: 5, y: height + 5.0, z: 0 });
        discription.setAttribute("scale", {
          x: scale,
          y: scale,
          z: scale,
        });
        discription.setAttribute(
          "font",
          "./assets/font/noto-sans-cjk-jp-msdf.json"
        );
        discription.setAttribute(
          "font-image",
          "./assets/font/noto-sans-cjk-jp-msdf.png"
        );
        discription.setAttribute("value", name);
        discription.setAttribute("negate", false);
        discription.setAttribute("color", "black");
        discription.setAttribute("look-at", "[camera]");
        if (link) {
          discription.setAttribute("link", `href:${link}`);
        }
        scene.appendChild(discription);
      }

      //------------------??????--------------------------------
      if (distanceEnable) {
        if (document.getElementById(`distance${id}`)) {
          var distance = document.getElementById(`distance${id}`);
        } else {
          var distance = document.createElement("a-text");
          distance.setAttribute("id", `distance${id}`);
        }
        distance.setAttribute(
          "gps-projected-entity-place",
          `latitude: ${latitude}; longitude: ${longitude};`
        );
        distance.setAttribute("class", "distance");
        // distance.setAttribute("updatedistance", "");
        distance.setAttribute("position", {
          x: 5,
          y: height - 5.0,
          z: 0,
        });
        distance.setAttribute("scale", {
          x: scale,
          y: scale,
          z: scale,
        });
        distance.setAttribute("value", "");
        distance.setAttribute("color", "black");
        distance.setAttribute("look-at", "[camera]");
        scene.appendChild(distance);
      }
    } else {
      //------------------3D??????????????????--------------------------------
      var ref = storage.ref(`/3Dmodel/${modelname}.gltf`).getDownloadURL();
      ref.then((url) => {
        let entity = document.createElement("a-entity");
        entity.setAttribute("id", id);
        entity.setAttribute(
          "gps-projected-entity-place",
          `latitude: ${latitude}; longitude: ${longitude};`
        );
        entity.setAttribute("position", { x: 0, y: height, z: 0 });
        entity.setAttribute("gltf-model", url);

        entity.setAttribute("animation-mixer", "");
        if (link) {
          entity.setAttribute("link", `href:${link}`);
        }
        if (caption) {
          entity.setAttribute("cursor-listener", { value: caption });
        }
        scene.appendChild(entity);
        console.log(entity);
      });

      //------------------??????--------------------------------
      if (labelEnable) {
        let discription = document.createElement("a-text");
        discription.setAttribute("id", `discription${id}`);
        discription.setAttribute(
          "gps-projected-entity-place",
          `latitude: ${latitude}; longitude: ${longitude};`
        );
        discription.setAttribute("position", { x: 5, y: height + 5.0, z: 0 });
        discription.setAttribute("scale", {
          x: scale,
          y: scale,
          z: scale,
        });
        discription.setAttribute(
          "font",
          "./assets/font/noto-sans-cjk-jp-msdf.json"
        );
        discription.setAttribute(
          "font-image",
          "./assets/font/noto-sans-cjk-jp-msdf.png"
        );
        discription.setAttribute("value", name);
        discription.setAttribute("negate", false);
        discription.setAttribute("color", "black");
        discription.setAttribute("look-at", "[camera]");
        if (link) {
          discription.setAttribute("link", `href:${link}`);
        }
        scene.appendChild(discription);
      }

      //------------------??????--------------------------------
      if (distanceEnable) {
        let distance = document.createElement("a-text");
        distance.setAttribute("id", `distance${id}`);
        distance.setAttribute(
          "gps-projected-entity-place",
          `latitude: ${latitude}; longitude: ${longitude};`
        );
        distance.setAttribute("class", "distance");
        // distance.setAttribute("updatedistance", "");
        distance.setAttribute("position", { x: 5, y: height - 5.0, z: 0 });
        distance.setAttribute("scale", {
          x: scale,
          y: scale,
          z: scale,
        });
        distance.setAttribute("value", "");
        distance.setAttribute("color", "black");
        distance.setAttribute("look-at", "[camera]");
        scene.appendChild(distance);
      }
    }
  }
}

// function staticLoadModels() {
//   return [
//     {
//       id: 1,
//       name: "??????",
//       location: {
//         latitude: 35.610087429851006,
//         longitude: 139.67916517782328,
//         height: 20,
//       },
//       model: "pin",
//       label: true,
//       minDistance: 0,
//       maxDistance: 0,
//       distance: true,
//       caption: "",
//       link: "",
//     },
//     {
//       id: 2,
//       name: "????????????",
//       location: {
//         latitude: 35.60618984,
//         longitude: 139.68464816,
//         height: 20,
//       },
//       model: "pin",
//       label: true,
//       minDistance: 0,
//       maxDistance: 0,
//       distance: true,
//       caption: "",
//       link: "",
//     },
//     {
//       id: 3,
//       name: "?????????????????????????????????",
//       location: {
//         latitude: 35.60644499,
//         longitude: 139.68397225,
//         height: 20,
//       },
//       model: "pin",
//       label: true,
//       minDistance: 0,
//       maxDistance: 0,
//       distance: true,
//       caption: "",
//       link: "",
//     },
//     {
//       id: 4,
//       name: "???????????????",
//       location: {
//         latitude: 35.6068287769,
//         longitude: 139.68478654721,
//         height: 20,
//       },
//       model: "pin",
//       label: true,
//       minDistance: 0,
//       maxDistance: 0,
//       distance: true,
//       caption: "",
//       link: "",
//     },
//   ];
// }
