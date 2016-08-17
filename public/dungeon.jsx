(() => {
  'strict';
  let hundredEyesPos = 'r1c1';
  let illuminatedCellsNew;
  let illuminatedCellsOld;
  let cellClassArr;
  let cellClassEffe;
  let darkNess;
  let firstGame = true;
  let wall;
  let wallsArray;
  const rows = 16;
  const columns = 16;
  let enemiesNo = 4;
  let cmHealth = 100;
  let hundredEyesLoc;
  const levelEnemyFactor = {1: 1, 2: 0.8, 3: 0.6};
  const levelHundredEyesFactor = {1: 1, 2: 1.2, 3: 1.4};
  let startMessage = `Defeat the evil Cricket Master in less than five minutes
                      . Make sure you kill his four guards first
                      before you engage him.`
  const weaponForce = {'bare hands': 1, qiang: 2, dao: 2.5, jian: 3};
  const weaponsArr = [{name:'qiang'}, {name: 'qiang'}, {name:'qiang'},
                      {name: 'dao'}, {name: 'dao'}, {name: 'jian'}
                      ];
  let enemiesArr = [{type: 'warrior', health: 20, pos: ''},
                    {type: 'warrior', health: 30, pos: ''},
                    {type: 'warrior', health: 40, pos: ''},
                    {type: 'warrior', health: 50, pos: ''},
                    {type: 'cm', health: 100, pos: ''}
                    ];
  let healthSuppliesArr = [{health: 20, pos: ''}, {health: 25, pos: ''},
                              {health: 30, pos: ''}, {health: 35, pos: ''},
                              {health: 40, pos: ''}, {health: 45, pos: ''},
                              {health: 50, pos: ''}, {health: 55, pos: ''}
                            ];

  const layFloor = () => {
    cellClassArr = [];
    for (let i = 0; i < rows; i++){
      let arr = [];
      for (let j = 0; j < columns; j++){
        arr.push('floor darkness');
      }
      cellClassArr.push(arr);
    }
  }

  const fightCricketMaster = (context, curPos, nextPos) => {
    let that = context;
    let healthDamage;
    let weaponF = weaponForce[that.state.weapon];
    let levelEnemyF = levelEnemyFactor[that.state.level];
    let randomInt10_20 = Math.floor(Math.random() * 10) + 10;
    let hundredEyesHealth = Math.floor(that.state.health - randomInt10_20 * 3);
    that.setState({health: hundredEyesHealth});
    deathOf100Is(that);
    randomInt10_20 = Math.floor(Math.random() * 10) + 10;
    cmHealth = Math.floor(cmHealth - randomInt10_20 * levelEnemyF * weaponF);
    if (cmHealth < 1){
      that.moveHundredEyes(curPos, nextPos);
      that.setState({message: 'Your name will be immortalized! People will still\
        be singing songs about you millenia from now!'});
    }
  }

  const fightGuard = (context, curPos, nextPos) => {
    let that = context;
    let warriorHealth;
    let healthDamage;
    let totalXp;
    let level;
    let weaponF = weaponForce[that.state.weapon];
    let levelEnemyF = levelEnemyFactor[that.state.level];
    let levelHundredEyesF = levelHundredEyesFactor[that.state.level];
    let randomInt10_20 = Math.floor(Math.random() * 10) + 10;
    let enemyAlive = true;
    let hundredEyesHealth = Math.floor(that.state.health - randomInt10_20 * levelHundredEyesF);
    that.setState({health: hundredEyesHealth});
    deathOf100Is(that);
    randomInt10_20 = Math.floor(Math.random() * 10) + 10;
    enemiesArr.map(function(enemy){
      if (enemy.pos === nextPos){
        enemy.health = Math.floor(enemy.health - randomInt10_20 * levelEnemyF * weaponF);
        if (enemy.health < 1) {
          enemyAlive = false;
          enemiesNo += -1;
          that.setState({message: 'Another one bites the dust! ' + enemiesNo + ' guards left'});
          totalXp = that.state.xp + Math.floor(Math.random() * 30 + 50);
          that.setState({xp: totalXp});
          level = Math.floor(totalXp / 100) + 1;
          that.setState({level: level});
        }
      }
    });
    if (enemyAlive === false){that.moveHundredEyes(curPos, nextPos);}
  }

  const createWalls = () => {
    wallsArray = [];
    for (let i = 0; i < 55; i++){
      wall = 'r' + (Math.floor(rows*(Math.random()))) + 'c' +
        (Math.floor(columns*(Math.random())));
      wallsArray.push(wall);
    }
  }

  const coord = (pos, classes) => {
    let indexC = pos.indexOf('c');
    let row = pos.slice(1, indexC);
    let column = pos.slice(indexC + 1);
    cellClassEffe[row][column] = classes;
  }

  const deathOf100Is = (that) => {
    if (that.state.health < 1) {
      document.removeEventListener('keydown', that.arrowKeys);
      that.setState({message: 'You have failed your Khan!!'});
      that.setState({health: 'D-E-A-D'});
      return;
    }
  }

  const hundredEyesStartLoc = () => {
    let startLocOk = false;
    let loc;
    while (startLocOk === false){
      loc = 'r' + (Math.floor(rows*(Math.random()))) + 'c' +
                      (Math.floor(columns*(Math.random())));
      if (wallsArray.indexOf(loc) === -1){
        startLocOk = true;
      }
    }
    return loc;
  }

  const Grid = React.createClass({
  	render: function () {
  		let that = this;
  		let rowsArr = [];
  		for (let i = 0; i < rows; i++){rowsArr.push('r' + i)};

  		const createCells = (cell) => {
        let indexC = cell.indexOf('c');
        let row = cell.slice(1, indexC);
        let column = cell.slice(indexC + 1);
        let arr = this.props.cellClassArr;
				return (<td key={cell} id={cell} className = {this.props.cellClassArr[row][column]}></td>);
  		}

  		const createRows = (row) => {
  			let cells = [];
  			for (let j = 0; j < columns; j++){
  				cells.push(row + 'c' + j);
  			}
  			return (<tr key={row}>{cells.map(createCells)}</tr>);
  		};

  		return (
        <div id='game'>
  				<table>
  					<tbody>
  						{rowsArr.map(createRows)}
  					</tbody>
  				</table>
        </div>
  		);
  	}
  });

  const Game = React.createClass({

		getInitialState: function () {
			return {
        cellClassArr: [],
        level: 1,
        xp: 0,
        health: 50,
        weapon: 'bare hands',
        message: startMessage
			};
		},

    componentWillMount: function () {
      createWalls();
      cellClassArr = [];
      layFloor();
      cellClassEffe = cellClassArr;
      this.setState({cellClassArr: cellClassArr});
    },

    componentDidMount : function() {
    			this.start();
		},

    start: function () {
      let that = this;
      wallsArray.map((wall) => {
        coord(wall, 'wall darkness');
        this.setState({cellClassArr: cellClassEffe});
      });
      hundredEyesPos = hundredEyesStartLoc();
      coord(hundredEyesPos, 'floor hundredEyes');
      this.enemiesPos();
      this.healthSuppliesPos();
      this.weaponsPos();
      this.IlluminatedArea();
      coord(hundredEyesPos, 'floor hundredEyes');
      this.setState({cellClassArr: cellClassEffe});
      document.addEventListener('keydown', this.arrowKeys);
      setTimeout(function(){
        document.removeEventListener('keydown', that.arrowKeys);
        if (that.state.health > 0){
          that.setState({message: 'You ran out of time'});
        }
      }, 300000);
    },

    restartGame: function () {
      enemiesArr[0].health = 20;
      enemiesArr[1].health = 30;
      enemiesArr[2].health = 40;
      enemiesArr[3].health = 50;
      enemiesArr[4].health = 100;
      enemiesNo = 4;
      cellClassArr = [];
      layFloor();
      cellClassEffe = cellClassArr;
      createWalls();
      this.setState({level: 1, xp: 0, health: 50, weapon: 'bare hands',
                     message: 'The Universe has given you another opportunity \
                     to make your Khan proud!'});
      firstGame = false;
      this.start();
    },

    moveHundredEyes: function(curPos, nextPos) {
      hundredEyesPos = nextPos;
      coord(curPos, 'floor');
      coord(nextPos, 'floor hundredEyes');
      this.IlluminatedArea();
      this.setState({cellClassArr: cellClassEffe});
    },

    nextPos: function(dir, n) {
      let curPos = hundredEyesPos;
      let nextCol;
      let nextRow;
      let nextPos;
      let that = this;
      if (dir === 'l' || dir === 'r'){
        nextCol = Number(curPos.slice(curPos.indexOf('c') + 1)) + n;
      } else {
        nextRow = Number(curPos.slice(curPos.indexOf('r') + 1,curPos.indexOf('c'))) + n;
      }
      if (nextCol === -1 || nextCol === columns || nextRow === -1|| nextRow === rows){return;}
      if (dir === 'l' || dir === 'r'){
        nextPos = curPos.replace(/c.*/, 'c' + nextCol);
      } else {
        nextPos = curPos.replace(/r[0-9]*/, 'r' + nextRow);
      }
      this.action(curPos, nextPos)
    },

    action: function(curPos, nextPos){
      let that = this;
      let r = Number(nextPos.slice(nextPos.indexOf('r') + 1, nextPos.indexOf('c')));
      let c = Number(nextPos.slice(nextPos.indexOf('c') + 1))
      let classVar = cellClassEffe[r][c];
      if (classVar === 'floor'){
        this.moveHundredEyes(curPos, nextPos);
        return;
      }
      if (classVar === 'wall'){
        this.setState({health: this.state.health - 100});
        deathOf100Is(that);
        this.moveHundredEyes(curPos, nextPos);
        return;
        }
      if (classVar === 'health-supplies'){
          healthSuppliesArr.map(function(supply){
            if (nextPos === supply.pos){
              that.moveHundredEyes(curPos, nextPos);
              that.setState({health: that.state.health + supply.health});
            }
          });
          return;
        }
      if (['qiang', 'dao', 'jian'].indexOf(classVar) !== -1){
          let weapon = classVar;
          this.setState({weapon: weapon});
          this.moveHundredEyes(curPos, nextPos);
          return;
        }
      if (classVar === 'warrior'){
        fightGuard(that, curPos, nextPos);
      }
      if (classVar === 'cm'){
      fightCricketMaster(that, curPos, nextPos);
      }
  },

    arrowKeys: function(e){
      e.preventDefault();
      switch (e.keyCode){
        case 37:
            this.nextPos('l', -1);
            break;
        case 38:
            this.nextPos('u', -1);
            break;
        case 39:
            this.nextPos('r', 1);
            break;
        case 40:
            this.nextPos('d', 1);
            break;
      }
    },

    enemiesPos: function () {
        let pos;
        let posFound;
        for (let i = 0; i < 5; i++){
          posFound = false;
          while (posFound === false){
            pos = 'r' + (Math.floor(rows*(Math.random()))) + 'c' +
            (Math.floor(columns*(Math.random())));
            let r = Number(pos.slice(pos.indexOf('r') + 1, pos.indexOf('c')));
            let c = Number(pos.slice(pos.indexOf('c') + 1))
            let classVar = cellClassEffe[r][c];
            if (classVar === 'floor darkness'){
              posFound = true;
              enemiesArr[i].pos = pos;
              let enemyClass = enemiesArr[i].type;
              coord(pos, enemyClass + ' darkness');
              this.setState({cellClassArr: cellClassEffe});
            }
          }
        }
    },

    healthSuppliesPos: function (){
      let pos;
      let posFound;
      for (let i = 0; i < 8; i++){
        posFound = false;
        while (posFound === false){
          pos = 'r' + (Math.floor(rows*(Math.random()))) + 'c' +
          (Math.floor(columns*(Math.random())));
          let r = Number(pos.slice(pos.indexOf('r') + 1, pos.indexOf('c')));
          let c = Number(pos.slice(pos.indexOf('c') + 1))
          let classVar = cellClassEffe[r][c];
          if (classVar === 'floor darkness'){
            healthSuppliesArr[i].pos = pos;
            posFound = true;
            coord(pos, 'health-supplies darkness');
          }
        }
      }
      this.setState({cellClassArr: cellClassEffe});
    },

    weaponsPos: function () {
      let pos;
      let posFound;
      let weapon;
      for (let i = 0; i < 6; i++){
        posFound = false;
        weapon = weaponsArr[i].name;
        while (posFound === false){
          pos = 'r' + (Math.floor(rows*(Math.random()))) + 'c' +
          (Math.floor(columns*(Math.random())));
          let r = Number(pos.slice(pos.indexOf('r') + 1, pos.indexOf('c')));
          let c = Number(pos.slice(pos.indexOf('c') + 1))
          let classVar = cellClassEffe[r][c];
          if (classVar === 'floor darkness'){
            posFound = true;
            coord(pos, weapon + ' darkness');
          }
        }
      }
      this.setState({cellClassArr: cellClassEffe});
    },

    IlluminatedArea: function () {
      let that = this;
      let classes;
      let noDarkness;
      let cell;
      let pos = hundredEyesPos;
      if (illuminatedCellsNew !== undefined){
        illuminatedCellsOld = JSON.parse(JSON.stringify(illuminatedCellsNew));
      }
      let row = Number(pos.slice(1, pos.indexOf('c'))) - 1;
      let column = Number(pos.slice(pos.indexOf('c') + 1)) - 1;
      let rEnd = row + 3;
      let cEnd = column + 3;
      illuminatedCellsNew = [];
      for (let r = row; r < rEnd; r++){
        for (let c = column; c < cEnd; c++){
          if (r === -1 || c === columns || c === -1|| r === rows){continue;}
          cell = 'r' + r + 'c' + c;
          classes = cellClassEffe[r][c];
          noDarkness = classes.replace(/ darkness/, '');
          if (pos !== cell){
            illuminatedCellsNew.push(cell);
            cellClassEffe[r][c] = noDarkness;
          }
        }
      }
      if (illuminatedCellsOld === undefined){return;}
      illuminatedCellsOld.map(function(cell){
        let r;
        let c;
        if (illuminatedCellsNew.indexOf(cell) === -1){
          r = Number(cell.slice(1, cell.indexOf('c')));
          c = Number(cell.slice(cell.indexOf('c') + 1));
          classes = cellClassEffe[r][c];
          if (cell !== pos && classes.split(' ').indexOf('darkness') === -1){
            darkNess = classes.replace(/$/, ' darkness');
            cellClassEffe[r][c] = darkNess;
            that.setState({cellClassArr: cellClassEffe});
          }
        }
      })
    },

		render: function() {
			return (
				<div>
					<Grid cellClassArr = {this.state.cellClassArr}/>
          <div id='stats'>
            <p id='level'><b>Level: </b> {this.state.level}</p>
            <p id='xp'><b>XP: </b>{this.state.xp}</p>
            <p id='health'><b>Health: </b>{this.state.health}</p>
            <p id='weapon'><b>Weapon: </b>{this.state.weapon}</p>
          </div>
          <div id='containing-table'>
            <p id='message_screen'>{this.state.message}</p>
          </div>
          <button onClick={this.restartGame}>Restart</button>
          <a href="https://github.com/Manolo-S/dungeon-game" className='github'>Code on GitHub</a>
        </div>
			);
	  }
});

ReactDOM.render(<Game/>, document.getElementById('grid'));

})();
