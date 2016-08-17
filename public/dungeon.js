'use strict';

(function () {
  'strict';

  var hundredEyesPos = 'r1c1';
  var illuminatedCellsNew = void 0;
  var illuminatedCellsOld = void 0;
  var cellClassArr = void 0;
  var cellClassEffe = void 0;
  var darkNess = void 0;
  var firstGame = true;
  var wall = void 0;
  var wallsArray = void 0;
  var rows = 16;
  var columns = 16;
  var enemiesNo = 4;
  var cmHealth = 100;
  var hundredEyesLoc = void 0;
  var levelEnemyFactor = { 1: 1, 2: 0.8, 3: 0.6 };
  var levelHundredEyesFactor = { 1: 1, 2: 1.2, 3: 1.4 };
  var startMessage = 'Defeat the evil Cricket Master in less than five minutes\n                      . Make sure you kill his four guards first\n                      before you engage him.';
  var weaponForce = { 'bare hands': 1, qiang: 2, dao: 2.5, jian: 3 };
  var weaponsArr = [{ name: 'qiang' }, { name: 'qiang' }, { name: 'qiang' }, { name: 'dao' }, { name: 'dao' }, { name: 'jian' }];
  var enemiesArr = [{ type: 'warrior', health: 20, pos: '' }, { type: 'warrior', health: 30, pos: '' }, { type: 'warrior', health: 40, pos: '' }, { type: 'warrior', health: 50, pos: '' }, { type: 'cm', health: 100, pos: '' }];
  var healthSuppliesArr = [{ health: 20, pos: '' }, { health: 25, pos: '' }, { health: 30, pos: '' }, { health: 35, pos: '' }, { health: 40, pos: '' }, { health: 45, pos: '' }, { health: 50, pos: '' }, { health: 55, pos: '' }];

  var layFloor = function layFloor() {
    cellClassArr = [];
    for (var i = 0; i < rows; i++) {
      var arr = [];
      for (var j = 0; j < columns; j++) {
        arr.push('floor darkness');
      }
      cellClassArr.push(arr);
    }
  };

  var fightCricketMaster = function fightCricketMaster(context, curPos, nextPos) {
    var that = context;
    var healthDamage = void 0;
    var weaponF = weaponForce[that.state.weapon];
    var levelEnemyF = levelEnemyFactor[that.state.level];
    var randomInt10_20 = Math.floor(Math.random() * 10) + 10;
    var hundredEyesHealth = Math.floor(that.state.health - randomInt10_20 * 3);
    that.setState({ health: hundredEyesHealth });
    deathOf100Is(that);
    randomInt10_20 = Math.floor(Math.random() * 10) + 10;
    cmHealth = Math.floor(cmHealth - randomInt10_20 * levelEnemyF * weaponF);
    if (cmHealth < 1) {
      that.moveHundredEyes(curPos, nextPos);
      that.setState({ message: 'Your name will be immortalized! People will still\
        be singing songs about you millenia from now!' });
    }
  };

  var fightGuard = function fightGuard(context, curPos, nextPos) {
    var that = context;
    var warriorHealth = void 0;
    var healthDamage = void 0;
    var totalXp = void 0;
    var level = void 0;
    var weaponF = weaponForce[that.state.weapon];
    var levelEnemyF = levelEnemyFactor[that.state.level];
    var levelHundredEyesF = levelHundredEyesFactor[that.state.level];
    var randomInt10_20 = Math.floor(Math.random() * 10) + 10;
    var enemyAlive = true;
    var hundredEyesHealth = Math.floor(that.state.health - randomInt10_20 * levelHundredEyesF);
    that.setState({ health: hundredEyesHealth });
    deathOf100Is(that);
    randomInt10_20 = Math.floor(Math.random() * 10) + 10;
    enemiesArr.map(function (enemy) {
      if (enemy.pos === nextPos) {
        enemy.health = Math.floor(enemy.health - randomInt10_20 * levelEnemyF * weaponF);
        if (enemy.health < 1) {
          enemyAlive = false;
          enemiesNo += -1;
          that.setState({ message: 'Another one bites the dust! ' + enemiesNo + ' guards left' });
          totalXp = that.state.xp + Math.floor(Math.random() * 30 + 50);
          that.setState({ xp: totalXp });
          level = Math.floor(totalXp / 100) + 1;
          that.setState({ level: level });
        }
      }
    });
    if (enemyAlive === false) {
      that.moveHundredEyes(curPos, nextPos);
    }
  };

  var createWalls = function createWalls() {
    wallsArray = [];
    for (var i = 0; i < 55; i++) {
      wall = 'r' + Math.floor(rows * Math.random()) + 'c' + Math.floor(columns * Math.random());
      wallsArray.push(wall);
    }
  };

  var coord = function coord(pos, classes) {
    var indexC = pos.indexOf('c');
    var row = pos.slice(1, indexC);
    var column = pos.slice(indexC + 1);
    cellClassEffe[row][column] = classes;
  };

  var deathOf100Is = function deathOf100Is(that) {
    if (that.state.health < 1) {
      document.removeEventListener('keydown', that.arrowKeys);
      that.setState({ message: 'You have failed your Khan!!' });
      that.setState({ health: 'D-E-A-D' });
      return;
    }
  };

  var hundredEyesStartLoc = function hundredEyesStartLoc() {
    var startLocOk = false;
    var loc = void 0;
    while (startLocOk === false) {
      loc = 'r' + Math.floor(rows * Math.random()) + 'c' + Math.floor(columns * Math.random());
      if (wallsArray.indexOf(loc) === -1) {
        startLocOk = true;
      }
    }
    return loc;
  };

  var Grid = React.createClass({
    displayName: 'Grid',

    render: function render() {
      var _this = this;

      var that = this;
      var rowsArr = [];
      for (var i = 0; i < rows; i++) {
        rowsArr.push('r' + i);
      };

      var createCells = function createCells(cell) {
        var indexC = cell.indexOf('c');
        var row = cell.slice(1, indexC);
        var column = cell.slice(indexC + 1);
        var arr = _this.props.cellClassArr;
        return React.createElement('td', { key: cell, id: cell, className: _this.props.cellClassArr[row][column] });
      };

      var createRows = function createRows(row) {
        var cells = [];
        for (var j = 0; j < columns; j++) {
          cells.push(row + 'c' + j);
        }
        return React.createElement(
          'tr',
          { key: row },
          cells.map(createCells)
        );
      };

      return React.createElement(
        'div',
        { id: 'game' },
        React.createElement(
          'table',
          null,
          React.createElement(
            'tbody',
            null,
            rowsArr.map(createRows)
          )
        )
      );
    }
  });

  var Game = React.createClass({
    displayName: 'Game',


    getInitialState: function getInitialState() {
      return {
        cellClassArr: [],
        level: 1,
        xp: 0,
        health: 50,
        weapon: 'bare hands',
        message: startMessage
      };
    },

    componentWillMount: function componentWillMount() {
      createWalls();
      cellClassArr = [];
      layFloor();
      cellClassEffe = cellClassArr;
      this.setState({ cellClassArr: cellClassArr });
    },

    componentDidMount: function componentDidMount() {
      this.start();
    },

    start: function start() {
      var _this2 = this;

      var that = this;
      wallsArray.map(function (wall) {
        coord(wall, 'wall darkness');
        _this2.setState({ cellClassArr: cellClassEffe });
      });
      hundredEyesPos = hundredEyesStartLoc();
      coord(hundredEyesPos, 'floor hundredEyes');
      this.enemiesPos();
      this.healthSuppliesPos();
      this.weaponsPos();
      this.IlluminatedArea();
      coord(hundredEyesPos, 'floor hundredEyes');
      this.setState({ cellClassArr: cellClassEffe });
      document.addEventListener('keydown', this.arrowKeys);
      setTimeout(function () {
        document.removeEventListener('keydown', that.arrowKeys);
        if (that.state.health > 0) {
          that.setState({ message: 'You ran out of time' });
        }
      }, 300000);
    },

    restartGame: function restartGame() {
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
      this.setState({ level: 1, xp: 0, health: 50, weapon: 'bare hands',
        message: 'The Universe has given you another opportunity \
                     to make your Khan proud!' });
      firstGame = false;
      this.start();
    },

    moveHundredEyes: function moveHundredEyes(curPos, nextPos) {
      hundredEyesPos = nextPos;
      coord(curPos, 'floor');
      coord(nextPos, 'floor hundredEyes');
      this.IlluminatedArea();
      this.setState({ cellClassArr: cellClassEffe });
    },

    nextPos: function nextPos(dir, n) {
      var curPos = hundredEyesPos;
      var nextCol = void 0;
      var nextRow = void 0;
      var nextPos = void 0;
      var that = this;
      if (dir === 'l' || dir === 'r') {
        nextCol = Number(curPos.slice(curPos.indexOf('c') + 1)) + n;
      } else {
        nextRow = Number(curPos.slice(curPos.indexOf('r') + 1, curPos.indexOf('c'))) + n;
      }
      if (nextCol === -1 || nextCol === columns || nextRow === -1 || nextRow === rows) {
        return;
      }
      if (dir === 'l' || dir === 'r') {
        nextPos = curPos.replace(/c.*/, 'c' + nextCol);
      } else {
        nextPos = curPos.replace(/r[0-9]*/, 'r' + nextRow);
      }
      this.action(curPos, nextPos);
    },

    action: function action(curPos, nextPos) {
      var that = this;
      var r = Number(nextPos.slice(nextPos.indexOf('r') + 1, nextPos.indexOf('c')));
      var c = Number(nextPos.slice(nextPos.indexOf('c') + 1));
      var classVar = cellClassEffe[r][c];
      if (classVar === 'floor') {
        this.moveHundredEyes(curPos, nextPos);
        return;
      }
      if (classVar === 'wall') {
        this.setState({ health: this.state.health - 100 });
        deathOf100Is(that);
        this.moveHundredEyes(curPos, nextPos);
        return;
      }
      if (classVar === 'health-supplies') {
        healthSuppliesArr.map(function (supply) {
          if (nextPos === supply.pos) {
            that.moveHundredEyes(curPos, nextPos);
            that.setState({ health: that.state.health + supply.health });
          }
        });
        return;
      }
      if (['qiang', 'dao', 'jian'].indexOf(classVar) !== -1) {
        var weapon = classVar;
        this.setState({ weapon: weapon });
        this.moveHundredEyes(curPos, nextPos);
        return;
      }
      if (classVar === 'warrior') {
        fightGuard(that, curPos, nextPos);
      }
      if (classVar === 'cm') {
        fightCricketMaster(that, curPos, nextPos);
      }
    },

    arrowKeys: function arrowKeys(e) {
      e.preventDefault();
      switch (e.keyCode) {
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

    enemiesPos: function enemiesPos() {
      var pos = void 0;
      var posFound = void 0;
      for (var i = 0; i < 5; i++) {
        posFound = false;
        while (posFound === false) {
          pos = 'r' + Math.floor(rows * Math.random()) + 'c' + Math.floor(columns * Math.random());
          var r = Number(pos.slice(pos.indexOf('r') + 1, pos.indexOf('c')));
          var c = Number(pos.slice(pos.indexOf('c') + 1));
          var classVar = cellClassEffe[r][c];
          if (classVar === 'floor darkness') {
            posFound = true;
            enemiesArr[i].pos = pos;
            var enemyClass = enemiesArr[i].type;
            coord(pos, enemyClass + ' darkness');
            this.setState({ cellClassArr: cellClassEffe });
          }
        }
      }
    },

    healthSuppliesPos: function healthSuppliesPos() {
      var pos = void 0;
      var posFound = void 0;
      for (var i = 0; i < 8; i++) {
        posFound = false;
        while (posFound === false) {
          pos = 'r' + Math.floor(rows * Math.random()) + 'c' + Math.floor(columns * Math.random());
          var r = Number(pos.slice(pos.indexOf('r') + 1, pos.indexOf('c')));
          var c = Number(pos.slice(pos.indexOf('c') + 1));
          var classVar = cellClassEffe[r][c];
          if (classVar === 'floor darkness') {
            healthSuppliesArr[i].pos = pos;
            posFound = true;
            coord(pos, 'health-supplies darkness');
          }
        }
      }
      this.setState({ cellClassArr: cellClassEffe });
    },

    weaponsPos: function weaponsPos() {
      var pos = void 0;
      var posFound = void 0;
      var weapon = void 0;
      for (var i = 0; i < 6; i++) {
        posFound = false;
        weapon = weaponsArr[i].name;
        while (posFound === false) {
          pos = 'r' + Math.floor(rows * Math.random()) + 'c' + Math.floor(columns * Math.random());
          var r = Number(pos.slice(pos.indexOf('r') + 1, pos.indexOf('c')));
          var c = Number(pos.slice(pos.indexOf('c') + 1));
          var classVar = cellClassEffe[r][c];
          if (classVar === 'floor darkness') {
            posFound = true;
            coord(pos, weapon + ' darkness');
          }
        }
      }
      this.setState({ cellClassArr: cellClassEffe });
    },

    IlluminatedArea: function IlluminatedArea() {
      var that = this;
      var classes = void 0;
      var noDarkness = void 0;
      var cell = void 0;
      var pos = hundredEyesPos;
      if (illuminatedCellsNew !== undefined) {
        illuminatedCellsOld = JSON.parse(JSON.stringify(illuminatedCellsNew));
      }
      var row = Number(pos.slice(1, pos.indexOf('c'))) - 1;
      var column = Number(pos.slice(pos.indexOf('c') + 1)) - 1;
      var rEnd = row + 3;
      var cEnd = column + 3;
      illuminatedCellsNew = [];
      for (var r = row; r < rEnd; r++) {
        for (var c = column; c < cEnd; c++) {
          if (r === -1 || c === columns || c === -1 || r === rows) {
            continue;
          }
          cell = 'r' + r + 'c' + c;
          classes = cellClassEffe[r][c];
          noDarkness = classes.replace(/ darkness/, '');
          if (pos !== cell) {
            illuminatedCellsNew.push(cell);
            cellClassEffe[r][c] = noDarkness;
          }
        }
      }
      if (illuminatedCellsOld === undefined) {
        return;
      }
      illuminatedCellsOld.map(function (cell) {
        var r = void 0;
        var c = void 0;
        if (illuminatedCellsNew.indexOf(cell) === -1) {
          r = Number(cell.slice(1, cell.indexOf('c')));
          c = Number(cell.slice(cell.indexOf('c') + 1));
          classes = cellClassEffe[r][c];
          if (cell !== pos && classes.split(' ').indexOf('darkness') === -1) {
            darkNess = classes.replace(/$/, ' darkness');
            cellClassEffe[r][c] = darkNess;
            that.setState({ cellClassArr: cellClassEffe });
          }
        }
      });
    },

    render: function render() {
      return React.createElement(
        'div',
        null,
        React.createElement(Grid, { cellClassArr: this.state.cellClassArr }),
        React.createElement(
          'div',
          { id: 'stats' },
          React.createElement(
            'p',
            { id: 'level' },
            React.createElement(
              'b',
              null,
              'Level: '
            ),
            ' ',
            this.state.level
          ),
          React.createElement(
            'p',
            { id: 'xp' },
            React.createElement(
              'b',
              null,
              'XP: '
            ),
            this.state.xp
          ),
          React.createElement(
            'p',
            { id: 'health' },
            React.createElement(
              'b',
              null,
              'Health: '
            ),
            this.state.health
          ),
          React.createElement(
            'p',
            { id: 'weapon' },
            React.createElement(
              'b',
              null,
              'Weapon: '
            ),
            this.state.weapon
          )
        ),
        React.createElement(
          'div',
          { id: 'containing-table' },
          React.createElement(
            'p',
            { id: 'message_screen' },
            this.state.message
          )
        ),
        React.createElement(
          'button',
          { onClick: this.restartGame },
          'Restart'
        ),
        React.createElement(
          'a',
          { href: 'https://github.com/Manolo-S/dungeon-game', className: 'github' },
          'Code on GitHub'
        )
      );
    }
  });

  ReactDOM.render(React.createElement(Game, null), document.getElementById('grid'));
})();
