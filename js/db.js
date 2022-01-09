
/**
 * A Db Manager for the json db reader.
 * Always call init to start all db readers.
 */
class DBManager{

    constructor(){
        this.finishLoaded = false;
        this.firstLoaded = false;
        this.databases = [];
    };

    /**
     * Add an database to the manager.
     * @param {String} name the filename of the database (without .json suffix)
     */
    addDb(name){
        this.databases.push(new DB(name));
    }

    /**
     * Get the database data by giving it's name
     * @param {String} name the name of the database
     * @returns the data of the database (undefined for no db found)
     */
    getDb(name){

        let target = undefined;

        for (let db of this.databases){
            if (db.name == name){
                target = db;
                break;
            }
        }

        if (target == undefined){
            console.error(`No database ${name} was find!`);
            return undefined;
        }

        return target.getData();

    }

    /**
     * Init the database and start updating the manager.
     */
    init(){
        for (let db of this.databases){
            db.init();
        }
    }

    /**
     * Check for all the databases if they are finish loaded
     * @returns {Boolean} if all the databases are finish loaded
     */
    checkLoad(){

        for (let db of this.databases){
            if (!db.checkLoad()){
                return false;
            }
        }
        
        return true;
    }

    /**
     * Update manager
     * Do different update in different situations.
     * @returns NULL
     */
    update(){

        if (!this.finishLoaded){
            this.finishLoaded = this.checkLoad();
            this.notLoad();
            return;
        }

        if (!this.firstLoaded){
            this.firstLoad();
            this.firstLoaded = true;
            return;
        }

        this.finishLoad();

    }

    /**
     * Function that will be called while first loaded.
     */
    firstLoad(){};

    /**
     * Update function after loaded.
     */
    finishLoad(){};

    /**
     * Update function before loaded.
     */
    notLoad(){};
}

/**
 * A Simple Db Reader by simply fetching json data
 */
class DB {
    
    /**
     * Get the Database name
     * @param {String} name 
     */
    constructor(name){
        this.name = name;
        this.finishLoad = false;
        this.data = undefined;
    }

    /**
     * Get the data of the database.
     * @returns Data of the database.
     */
    getData(){
        return this.data['DATA'];
    }

    /**
     * 
     * @returns {Boolean} if the database is finish loading
     */
    checkLoad(){
        return this.finishLoad;
    }

    /**
     * Loader
     * After fetching data, it will change it's status to finishLoad
     * and put the json result into `this.data`
     */
    init(){
        fetch(`./src/db/${this.name}.json`)
        .then((response) => {
            return response.json();
        }).then((json) => {
            this.data = json;
            this.finishLoad = true;
        })
    }
}