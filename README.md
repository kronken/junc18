# Junction 2018 project

Project for team Kyychi in Junction 2018.

## Challenge

* Use cases: https://drive.google.com/file/d/1xRJzWirQYlfuo3qtC0h2v4aHMFd6eD4Y/view
* Google drive: https://drive.google.com/drive/folders/19ptwz2_PHNWmPEFSqyjegbi3GwHMgaH2
* Junction challenge page: https://2018.hackjunction.com/challenges/wisdom-of-crowds

## Requirements

* Install Docker, Docker-compose and Yarn.
* Run `docker-compose up -d` to start PostGIS database.
* Run `yarn install` to install required packages.

Shuffle files around:

```bash
mkdir data
cp teliaData/Footfall\ data/Shapefiles/Uusimaa_ff_grids.* data
cp teliaData/Footfall\ data/*.txt data
cp teliaData/Activity\ data/Shapefiles/FI_MTC_WGS84_update.* data
cp teliaData/Activity\ data/*.txt data
```

## Projects

### Crowd Importer

Imports data into the postgres database.

* Start the compose stuff.
* Run it once by running `yarn run import:crowd`.
* Run `docker-compose restart`.

### Frontend

Simple webpage that renders the predictions as a heatmap.

Run it by running `yarn frontend`. Browse http://localhost:3000.

### Weather

Machine learning project that predicts how many people there will be based on different parameters.

* `cd weather`
* Run `python3 -m venv venv`
* Run `source venv/bin/activate`
* Run `pip install -r requirements.txt`
* Run `./start.sh`
