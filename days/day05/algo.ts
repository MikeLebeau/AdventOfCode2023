import { examplePuzzle, realPuzzle } from './puzzle';

let seeds: Seed[] = [];
let maps: Map[] = [];

enum MapName {
  Soil = 'seed-to-soil',
  Fertilizer = 'soil-to-fertilizer',
  Water = 'fertilizer-to-water',
  Light = 'water-to-light',
  Temperature = 'light-to-temperature',
  Humidity = 'temperature-to-humidity',
  Location = 'humidity-to-location'
}

class Seed {
  id: number;
  soildID: number;
  fertilizerID: number;
  waterID: number;
  lightID: number;
  temperatureID: number;
  humidityID: number;
  locationID: number;

  constructor(id: number) {
    this.id = id;
  }

  getSoilId(): number {
    if(this.soildID) {
      return this.soildID;
    }

    const soilMap = maps.find((map) => map.name === MapName.Soil);
    let soilId = this.id;

    for(let i = 0; i < soilMap.source.length; i++){
      const source = soilMap.source[i];

      if(source <= this.id && this.id <= source+soilMap.range[i]) {
        const bump = this.id-source;
        soilId = soilMap.destination[i]+bump;
        break;
      }
    }

    // console.log('Soil ID:', soilId);
    this.soildID = soilId;
    return soilId;
  }

  getFertilizerId(): number {
    if(this.fertilizerID) {
      return this.fertilizerID;
    }

    const fertilizerMap = maps.find((map) => map.name === MapName.Fertilizer);
    const soilId = this.getSoilId();
    let fertilizerId = soilId;

    for(let i = 0; i < fertilizerMap.source.length; i++){
      const source = fertilizerMap.source[i];

      if(source <= soilId && soilId <= source+fertilizerMap.range[i]) {
        const bump = soilId-source;
        fertilizerId = fertilizerMap.destination[i]+bump;
        break;
      }
    }

    // console.log('Fertilizer ID:', fertilizerId);
    this.fertilizerID = fertilizerId;
    return fertilizerId;
  }

  getWaterId(): number {
    if(this.waterID) {
      return this.waterID;
    }

    const waterMap = maps.find((map) => map.name === MapName.Water);
    const fertilizerId = this.getFertilizerId();
    let waterId = fertilizerId;

    for(let i = 0; i < waterMap.source.length; i++){
      const source = waterMap.source[i];

      if(source <= fertilizerId && fertilizerId <= source+waterMap.range[i]) {
        const bump = fertilizerId-source;
        waterId = waterMap.destination[i]+bump;
        break;
      }
    }

    // console.log('Water ID:', waterId);
    this.waterID = waterId;
    return waterId;
  }

  getLightId(): number {
    if(this.lightID) {
      return this.lightID;
    }

    const lightMap = maps.find((map) => map.name === MapName.Light);
    const waterId = this.getWaterId();
    let lightId = waterId;

    for(let i = 0; i < lightMap.source.length; i++){
      const source = lightMap.source[i];

      if(source <= waterId && waterId <= source+lightMap.range[i]) {
        const bump = waterId-source;
        lightId = lightMap.destination[i]+bump;
        break;
      }
    }

    // console.log('Light ID:', lightId);
    this.lightID = lightId;
    return lightId;
  }

  getTemperatureId(): number {
    if(this.temperatureID) {
      return this.temperatureID;
    }

    const temperatureMap = maps.find((map) => map.name === MapName.Temperature);
    const lightId = this.getLightId();
    let temperatureId = lightId;

    for(let i = 0; i < temperatureMap.source.length; i++){
      const source = temperatureMap.source[i];

      if(source <= lightId && lightId <= source+temperatureMap.range[i]) {
        const bump = lightId-source;
        temperatureId = temperatureMap.destination[i]+bump;
        break;
      }
    }

    // console.log('Temperature ID:', temperatureId);
    this.temperatureID = temperatureId;
    return temperatureId;
  }

  getHumidityId(): number {
    if(this.humidityID) {
      return this.humidityID;
    }

    const humidityMap = maps.find((map) => map.name === MapName.Humidity);
    const temperatureId = this.getTemperatureId();
    let humidityId = temperatureId;

    for(let i = 0; i < humidityMap.source.length; i++){
      const source = humidityMap.source[i];

      if(source <= temperatureId && temperatureId <= source+humidityMap.range[i]) {
        const bump = temperatureId-source;
        humidityId = humidityMap.destination[i]+bump;
        break;
      }
    }

    // console.log('Humidity ID:', humidityId);
    this.humidityID = humidityId;
    return humidityId;
  }

  getLocationId(): number {
    if(this.locationID) {
      return this.locationID;
    }

    const locationMap = maps.find((map) => map.name === MapName.Location);
    const humidityId = this.getHumidityId();
    let locationId = humidityId;

    for(let i = 0; i < locationMap.source.length; i++){
      const source = locationMap.source[i];

      if(source <= humidityId && humidityId <= source+locationMap.range[i]) {
        const bump = humidityId-source;
        locationId = locationMap.destination[i]+bump;
        break;
      }
    }

    // console.log('Location ID:', locationId);
    this.locationID = locationId;
    return locationId;
  }
}

class Map {
  name: MapName | String;
  destination: number[] = [];
  source: number[] = [];
  range: number[] = [];

  constructor(name: String) {
    this.name = name;
  }
}

function initSeed(seedLine: String){
  seeds = [];
  seedLine.split(/\s+/).forEach((seedId) => {
    if(!isNaN(Number(seedId))) {
      seeds.push(new Seed(Number(seedId)));
    }
  })
}

function initSeedSecond(seedLine: String){
  seeds = [];
  let compteur = 0;
  const splittedSeedLine = seedLine.split(/\s+/);
  
  for(let i = 0; i < splittedSeedLine.length; i++){
    const seedId = splittedSeedLine[i];

    
    if(!isNaN(Number(seedId))) {
      for(let j = 0; j < Number(splittedSeedLine[i+1]); j++){
        // console.log(Number(seedId)+j);
        seeds.push(new Seed(Number(seedId)+j));
        compteur++;
      }
      i++;
    }
  }

  console.log(compteur);
  console.log(seeds);
}

function initMaps(lines: String[]) {
  maps = [];
  let currentMapName = "";

  lines.forEach((line, index) => {
    if(line !== '' && index !== 0) {
      // Map name
      if(line.match("map")){
        const mapName = line.split(/\s+/)[0];
        maps.push(new Map(mapName));
        currentMapName = mapName;
      } else {
        // Range
        const range = line.split(/\s+/);
        maps
        .filter((map) => map.name === currentMapName)
        .map((map) => {
          map.destination.push(Number(range[0]));
          map.source.push(Number(range[1]));
          map.range.push(Number(range[2]));
        })
      }
    }
  })
}

function one(useRealPuzzle: boolean = true): String {
  const lines: String[] = useRealPuzzle
    ? realPuzzle.trim().split('\n')
    : examplePuzzle.trim().split('\n');

  initSeed(lines[0]);
  initMaps(lines);

  let finalResult: number;
  seeds.forEach((seed) => {
    const location = seed.getLocationId();
    if(!finalResult || finalResult > location) {
      finalResult = location;
    }
  });

  return `Day 05* ${
    useRealPuzzle ? 'realPuzzle' : 'examplePuzzle'
  }: ${finalResult}`;
}

function two(useRealPuzzle: boolean = true): String {
  const lines: String[] = useRealPuzzle
    ? realPuzzle.trim().split('\n')
    : examplePuzzle.trim().split('\n');

  initSeedSecond(lines[0]);
  // initMaps(lines);

  // Complete the initialization
  // seeds.forEach((seed) => {
  //   seed.getSoilId();
  //   seed.getFertilizerId();
  //   seed.getWaterId();
  //   seed.getLightId();
  //   seed.getTemperatureId();
  //   seed.getHumidityId();
  //   seed.getLocationId();
  // });

  // console.log(seeds);


  let finalResult: number;
  // seeds.forEach((seed) => {
  //   const location = seed.getLocationId();
  //   if(!finalResult || finalResult > location) {
  //     finalResult = location;
  //   }
  // });

  return `Day 05** ${
    useRealPuzzle ? 'realPuzzle' : 'examplePuzzle'
  }: ${finalResult}`;
}

export default { one, two };
