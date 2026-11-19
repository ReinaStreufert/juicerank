(function() {
  let tracks = {};
  window.tracks = tracks;

  let createTrack = function(family, versions) {
    let track = {};
    track.family = family;
    let loadFromJSON = function(data) {
      track.versions = [];
      for (let i = 0; i < data.length; i++) {
        let versionJSON = data[i];
        if (!versionJSON.hasAudio) {
          continue;
        }
        let version = {};
        version.title = versionJSON.title;
        version.imageSrc = versionJSON.cover;

      }
      track.name = data.name;
      if (data.image_url[0] == "/") {
        track.imageSrc = encodeURI("https://juicewrldapi.com" + data.image_url);
      }
      track.audio = [
        {
          version: 0,
          id: id,
          src:
        }
      ];
      track.audioSrc = ;
      track.loaded = true;
    };
    if (metadataJSON) {
      loadFromJSON(metadataJSON);
    }
    track.load = async function() {
      if (!track.loaded) {
        let response = await fetch(`https://juicewrldapi.com/juicewrld/songs/${track.id}/`);
        if (!response.ok) {
          return false;
        }
        let data = await response.json();
        loadFromJSON(data);
        return true;
      }
    };
    return track;
  };

  tracks.fromId = function(id) {
    return createTrack(id, undefined);
  };

  tracks.all = async function() {
    let count = 0;
    let read = 0;
    let result = [];
    for (let page = 1;; page++) {
      let response = await fetch(`juice.json`);
      if (!response.ok) {
        return null;
      }
      let data = await response.json();
      count = data.count;
      for (let i = 0; i < data.results.length; i++) {
        let trackJSON = data.results[i];
        result.push(createTrack(trackJSON.id, trackJSON));
      }
      read += data.results.length;
      if (read >= count) {
        return result;
      }
    }
  };
})();
