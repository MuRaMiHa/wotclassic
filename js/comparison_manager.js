var _____WB$wombat$assign$function_____ = function(name) {return (self._wb_wombat && self._wb_wombat.local_init && self._wb_wombat.local_init(name)) || self[name]; };
if (!self.__WB_pmw) { self.__WB_pmw = function(obj) { this.__WB_source = obj; return this; } }
{
  let window = _____WB$wombat$assign$function_____("window");
  let self = _____WB$wombat$assign$function_____("self");
  let document = _____WB$wombat$assign$function_____("document");
  let location = _____WB$wombat$assign$function_____("location");
  let top = _____WB$wombat$assign$function_____("top");
  let parent = _____WB$wombat$assign$function_____("parent");
  let frames = _____WB$wombat$assign$function_____("frames");
  let opener = _____WB$wombat$assign$function_____("opener");

(function($, window, document, wot_hl, amplify, _, wgsdk, undefined) {

'use strict';

var STORAGE_PLAYER_NAME = 'pcmp',
    STORAGE_TANK_NAME = 'tank',
    STORAGE_CHECK_INTERVAL = 1000,
    STORAGE_EXPIRE_MS = 8.64e+7;

function ComparisonManager() {
    var playerValue, savedPlayerValue, tankValue, savedTankValue;

    if (ComparisonManager.prototype._singletonInstance) {
        return ComparisonManager.prototype._singletonInstance;
    }
    ComparisonManager.prototype._singletonInstance = this;
    
    playerValue = amplify.store(STORAGE_PLAYER_NAME);
    if (playerValue === undefined) {
        playerValue = '';
    }

    tankValue = amplify.store(STORAGE_TANK_NAME);
    if (tankValue === undefined) {
        tankValue = [];
    }
    savedPlayerValue = playerValue;
    savedTankValue = tankValue;

    this.nicknames = _.compact(playerValue.split('-'));
    this.tanks = savedTankValue;

    this.getPlayersCount = function() {
        return this.nicknames.length;
    };
    
    this.getTanksCount = function() {
        return this.tanks.length;
    };

    this.getNicknames = function() {
        return this.nicknames;
    };

    this.isNicknameInComparison = function(nickname) {
        return (_.contains(this.nicknames, nickname));
    };

    this._savePlayer = function() {
        var playerValue = _.uniq(this.nicknames).join('-');
        amplify.store(STORAGE_PLAYER_NAME, playerValue, { expires: STORAGE_EXPIRE_MS});
        savedPlayerValue = playerValue;
    };
    
    this._saveTanks = function() {
        var tankValue = this.tanks;
        amplify.store(STORAGE_TANK_NAME, tankValue, { expires: STORAGE_EXPIRE_MS});
        savedTankValue = tankValue;
        amplify.publish('tankscomparison:tank-list', { tanks : tankValue });
    };

    this._checkStorage = function() {
        var playerValue = amplify.store(STORAGE_PLAYER_NAME) || '',
            tankValue = amplify.store(STORAGE_TANK_NAME) || [],
            currentPlayers,
            storagePlayers, 
            playersToAdd, 
            playersToRemove,
            currentTanks,
            storageTanks, 
            tanksToAdd = [], 
            tanksToRemove = [];
            
        if (playerValue !== savedPlayerValue) {
            currentPlayers = _.without(_.uniq(savedPlayerValue.split('-')), '');
            storagePlayers = _.without(_.uniq(playerValue.split('-')), '');

            playersToRemove = _.difference(currentPlayers, storagePlayers);
            playersToAdd = _.difference(storagePlayers, currentPlayers);
            
            if (playersToAdd.length !== 0 || playersToRemove.length !== 0) {

                _.each(playersToAdd, function(nickname) {
                    amplify.publish('playerscomparison:player-added', { nickname: nickname, from: 'storagecheck' });
                });

                _.each(playersToRemove, function(nickname) {
                    amplify.publish('playerscomparison:player-removed', { nickname: nickname, from: 'storagecheck' });
                });

                this._savePlayer();
            }
        }

        if (JSON.stringify(tankValue) !== JSON.stringify(savedTankValue)) {
            currentTanks = savedTankValue;
            storageTanks = tankValue;
            
            if (currentTanks.length > storageTanks.length) {
                tanksToRemove = this._getDifferentItems(currentTanks, storageTanks);
                _.each(tanksToRemove, function(tank) {
                    amplify.publish('tankscomparison:tank-removed', { tank: tank, from: 'storagecheck' });
                });
            } else {
                tanksToAdd = this._getDifferentItems(storageTanks, currentTanks);
                _.each(tanksToAdd, function(tank) {
                    amplify.publish('tankscomparison:tank-added', { tank: tank, from: 'storagecheck' });
                });
            }

            this._saveTanks();
        }
    };
    
    this._checkTankForReject = function(firstItem, secondItem) {
        return (firstItem.cd + '-' + firstItem.config === secondItem.cd + '-' + secondItem.config);
    };
    
    this._getDifferentItems = function(fromArray, toArray) {
        _.each(toArray, function(item) {
            fromArray = _.reject(fromArray, function(tank) {
                return this._checkTankForReject(item, tank);
            }, this);
        }, this);
        
        return fromArray;
    };

    setInterval(_.bind(this._checkStorage, this), STORAGE_CHECK_INTERVAL);

    amplify.subscribe('playerscomparison:player-added', _.bind(function(data) {

        if (data.nickname !== undefined) {

            if (!_.contains(this.nicknames, data.nickname) && this.nicknames.length < window.MAX_COMPARE_ACCOUNTS_NUMBER) {

                this.nicknames.push(data.nickname);

                /* Ping server to preload data in server cache */
                if (data.from !== 'storagecheck') {

                    $.ajax({
                        method: 'get',
                        data: {
                            u: data.nickname
                        },
                        url: window.COMPARE_ACCOUNTS_PRELOAD_URL
                    });

                }
            }

            if (data.from !== 'storagecheck') {
                this._savePlayer();
            }
        }
    }, this));

    amplify.subscribe('playerscomparison:player-removed', _.bind(function(data) {
        if (data.nickname !== undefined && _.indexOf(this.nicknames, data.nickname) !== -1) {
            this.nicknames = _.without(this.nicknames, data.nickname);
            if (data.from !== 'storagecheck') {
                this._savePlayer();
            }
        }
    }, this));
    
    amplify.subscribe('tankscomparison:tank-added', _.bind(function(data) {

        if (data.tank !== undefined) {

            if (!_.contains(this.tanks, data.tank)) { 
                this.tanks.push(data.tank);
            }

            this._saveTanks();
        }
    }, this));
    
    amplify.subscribe('tankscomparison:tank-removed', _.bind(function(data) {
        var tanksAfterRemove = _.reject(this.tanks, function(item) {
                return this._checkTankForReject(item, data.tank);
            }, this);
        
        if (data.tank !== undefined && tanksAfterRemove.length < this.tanks.length) { 
            this.tanks = tanksAfterRemove;

            if (data.from !== 'storagecheck') {
                this._saveTanks();
            }
        }
    }, this));
    
    amplify.subscribe('tankscomparison:get-list', _.bind(function() {
        amplify.publish('tankscomparison:tank-list', { tanks : this.tanks });
    }, this));
}

window.ComparisonManager = ComparisonManager;

})(jQuery, window, document, wot_hl, amplify, _, wgsdk);

}
/*
     FILE ARCHIVED ON 06:49:01 Sep 16, 2016 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 12:31:23 Jun 01, 2021.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
/*
playback timings (ms):
  LoadShardBlock: 135.868 (3)
  exclusion.robots.policy: 0.135
  PetaboxLoader3.datanode: 157.341 (5)
  captures_list: 163.992
  load_resource: 225.003 (2)
  esindex: 0.013
  PetaboxLoader3.resolve: 123.855 (2)
  RedisCDXSource: 2.622
  CDXLines.iter: 21.804 (3)
  exclusion.robots: 0.146
*/