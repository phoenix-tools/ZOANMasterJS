/**
 * 
 * @title ZOANMasterJS.js
 * @description Welcome ZOANMasterJS! ZOANMasterJS is a JS class that enhances the app.cryptozoon.io UX experience while also offering an edge to battle
 * 
 * @ver 2.4.1
 * @author: phoenixtools
 * @contributors: Hudson Atwell
 */
 
 var ZOANMasterJS = {
    
	version: "2.4.1",
    scriptsLoaded : false,
	balances : {},
	zoans : {},
	marketPrices : {},
	currentFeeScope : "today",
	currentBattleScope : "today",
	coinGecko: {},
	gameStats: {},
	gitHub: {},
	intervals : {},
	listeners : {},
	topOffet : "33px",

	init : function() {
		
		this.loadMetaMaskListeners();
		this.loadBattleHistory();
		this.loadHeader();
		this.loadWeb3();
		this.readZones();
		
		setTimeout(function(dm) {
			if (!window.ethereum.selectedAddress) {
				return true;
			}
			dm.loadPrices();
		} , 600 , this );
		
		this.intervals.listeners = setInterval(function( zm ) {
			zm.loadListeners();
		}, 500 , this )
		
		this.intervals.zoanTracker = setInterval(function( zm ) {
			zm.readZones();
		}, 5000 , this )
		
	}
	
	,
	
	destroyCurrentInstance : function() {
		
		/* remove header */
		document.querySelector('.ZOANMasterJS').parentNode.removeChild(document.querySelector('.ZOANMasterJS'));
		
		/* remove fight history */
		document.querySelector('.zoanmaster-stats-container').parentNode.removeChild(document.querySelector('.zoanmaster-stats-container'));
		
		/* destroy all current intervals */
		for (key in ZOANMasterJS.intervals) {
			clearInterval(ZOANMasterJS.intervals[key])
		}
		
		/* set select ZOANMasterJS data back to default */
		this.balances = {}
		this.marketPrices = {}
		this.intervals = {}
		this.listeners = {}
		this.currentFeeScope = "today"
		this.currentBattleScope = "today"
		this.topOffet = "33px"
		
		
	}
	
	,
	
	loadMetaMaskListeners : function() {
		
		/* on acount change */
		window.ethereum.on('accountsChanged', function (accounts) {

			
			/* Destroy BladeMaserJS instance */
			ZOANMasterJS.destroyCurrentInstance()
			
			/* Rebuild ZOANMasterJS instance */
			setTimeout(function() {
				ZOANMasterJS.init();
			}, 1000 )
			
		})
	}
	
	,
	
	loadListeners : function() {
		
		/**
		 *Listen for Refresh
		 */
		if (document.querySelector('#refresh-zoanmaster') && !ZOANMasterJS.listeners.refresh) {
			
			ZOANMasterJS.listeners.refresh = true;
			
			/* listen for TIP BNB event */
			document.querySelector('#refresh-zoanmaster').addEventListener('click', function() {
				/* Destroy BladeMaserJS instance */
				ZOANMasterJS.destroyCurrentInstance()
				
				/* Rebuild ZOANMasterJS instance */
				setTimeout(function() {
					ZOANMasterJS.init();
					ZOANMasterJS.checkForUpdates();
				}, 500 )
			}  )
		}
		
		
		/**
		 *Listen for BNB tip 
		 */
		if (document.querySelector('.bnb-tip') && !ZOANMasterJS.listeners.bnbTip) {
			
			ZOANMasterJS.listeners.bnbTip = true;
			
			/* listen for TIP BNB event */
			document.querySelector('.bnb-tip').addEventListener('click', function() {
				ZOANMasterJS.listeners.bnbTip = true;
				
				var transactionHash = window.ethereum.request({
				    method: 'eth_sendTransaction',
				    params: [
				      {
				        to: '0x73ed2Ee96629e89125f201aBf60fdd8239A20ec8',
				        from: window.ethereum.selectedAddress,
				        value: Web3.utils.toHex(Web3.utils.toWei("0.01")),
				      },
				    ],
				  });
			} , {once :true} )
		}
		
		/**
		 * Listen for zoon tip (not active at the moment)
		 */ 
		if (document.querySelector('.zoon-tip') && !ZOANMasterJS.listeners.zoonTip) {

			ZOANMasterJS.listeners.zoonTip = true;
				
			/* listen for TIP zoon event */
			document.querySelector('.zoon-tip').addEventListener('click', function() {
				
			})
			
		}
		
		/**
		 * Listen for fee range cycle clicks 
		 */
		if (document.querySelector('.nav-item')  && !ZOANMasterJS.listeners.navClick) {
			
			ZOANMasterJS.listeners.navClick = true;
			
			document.querySelector('.nav-item').addEventListener('click', function() {
				//console.log("nav item clicked")
			})
		}
		
		
		/**
		 * Listen for fee range cycle clicks 
		 */
		if (document.querySelector('.cycle-fee-scope-forward')  && !ZOANMasterJS.listeners.feeScopeForward) {
			
			
			ZOANMasterJS.listeners.feeScopeForward = true;
			/* listen for TIP zoon event */
			document.querySelector('.cycle-fee-scope-forward').addEventListener('click', function() {
				
				document.querySelectorAll(".fee-bnb").forEach( function(feeContainer) {
					feeContainer.style.display = "none";
				})
						
				switch(ZOANMasterJS.currentFeeScope) {
					case "today":
						ZOANMasterJS.currentFeeScope = "week";
						break;
					case "week":
						ZOANMasterJS.currentFeeScope = "month";
						break;
					case "month":
						ZOANMasterJS.currentFeeScope = "today";
						break;	
				}
				
				
				document.querySelector("#fee-bnb-contatiner-" + ZOANMasterJS.currentFeeScope ).style.display = "inline-block";
			
			} )
		}

		/**
		 * Listen for Fight Stats reveal
		 */ 
		 if (document.querySelector('.show-zoan-fight') && !ZOANMasterJS.listeners.showZoanFights) {

			ZOANMasterJS.listeners.showZoanFights = true;
				
			document.querySelector('.show-zoan-fight').addEventListener('click', function() {
				var fightHistory = document.querySelector('.zoan-fight-history');
				
				/* show stats container*/
				document.querySelector('.zoanmaster-stats-container').style.display = "flex";
				
				/* make sure box stat history is closed */
				document.querySelector('.box-stat-history').style.display = "none"
				
				
				if (window.getComputedStyle(fightHistory).display == "none") {
					fightHistory.style.display = "flow-root";
					fightHistory.style.height = "100vh";
					ZOANMasterJS.topOffet = "100vh";
					document.querySelector('.cycle-fight-history').style.display = "flow-root";
				}
				else {
					document.querySelector('.zoanmaster-stats-container').style.display = "none";
					document.querySelector('.cycle-fight-history').style.display = "none";
					fightHistory.style.display = "none";
					ZOANMasterJS.topOffet = "33px";
				}
				
				/* make sure the correct fights are displayed */
				var fighRecords = document.querySelectorAll(".fight-record." + ZOANMasterJS.currentBattleScope ); 
			    for(var i = 0; i < fighRecords.length; i++){
			        fighRecords[i].style.display = "table-row"; // depending on what you're doing
			    }
			
			})
			
		}
		
		/**
		 * Listen for Fight Stats reveal
		 */ 
		 if (document.querySelector('.show-box-stats') && !ZOANMasterJS.listeners.showBoxStats) {

			ZOANMasterJS.listeners.showBoxStats = true;
				
			document.querySelector('.show-box-stats').addEventListener('click', function() {
				document.querySelector('.zoanmaster-stats-container').style.display = "flex";
				document.querySelector('.zoan-fight-history').style.display = "none";
				var fightHistory = document.querySelector('.box-stat-history');

				
				
				if (window.getComputedStyle(fightHistory).display == "none") {
					fightHistory.style.display = "flow-root";
					fightHistory.style.height = "100vh";
					ZOANMasterJS.topOffet = "100vh";
					document.querySelector('.cycle-fight-history').style.display = "flow-root";
				}
				else {
					document.querySelector('.zoanmaster-stats-container').style.display = "none";
					document.querySelector('.cycle-fight-history').style.display = "none";
					fightHistory.style.display = "none";
					ZOANMasterJS.topOffet = "33px";
				}
			
			})
			
		}

		/**
		 * Cycle the fight stats forward
		 */
		 if (document.querySelector('.cycle-fight-stats-forward')  && !ZOANMasterJS.listeners.battleScopeForward) {

			
			ZOANMasterJS.listeners.battleScopeForward = true;
			
			/* listen for TIP ZOON event */
			document.querySelector('.cycle-fight-stats-forward').addEventListener('click', function() {
				
				/* make sure the old fights records are hidden */
				var fighRecords = document.querySelectorAll(".fight-record." + ZOANMasterJS.currentBattleScope ); 
			    for(var i = 0; i < fighRecords.length; i++){
			        fighRecords[i].style.display = "none"; // depending on what you're doing
			    }
			
				
				switch(ZOANMasterJS.currentBattleScope) {
					case "today":
						ZOANMasterJS.currentBattleScope = "week";
						document.querySelector('.cylce-fight-label').innerText = "LAST 7 DAYS"
						break;
					case "week":
						ZOANMasterJS.currentBattleScope = "month";
						document.querySelector('.cylce-fight-label').innerText = "LAST 31 DAYS"
						break;
					case "month":
						ZOANMasterJS.currentBattleScope = "all";
						document.querySelector('.cylce-fight-label').innerText = "1000 FIGHTS"
						break;	
					case "all":
						ZOANMasterJS.currentBattleScope = "today";
						document.querySelector('.cylce-fight-label').innerText = "LAST 24 HOURS"
						break;	
				}
				
				
				/* replce all the statistics */
				ZOANMasterJS.loadFightHistoryStats(ZOANMasterJS.currentBattleScope)
				
				
				/* make sure the correct fights are displayed */
				var fighRecords = document.querySelectorAll(".fight-record." + ZOANMasterJS.currentBattleScope ); 
			    for(var i = 0; i < fighRecords.length; i++){
			        fighRecords[i].style.display = "table-row"; // depending on what you're doing
			    }
			
			} )
		}
		
		
		/**
		 * Cycle the fight stats backwards
		 */
		if (document.querySelector('.cycle-fight-stats-backward')  && !ZOANMasterJS.listeners.battleScopeBackward) {
			
			
			ZOANMasterJS.listeners.battleScopeBackward = true;
			
			/* listen for TIP ZOON event */
			document.querySelector('.cycle-fight-stats-backward').addEventListener('click', function() {
				
				/* make sure the old fights records are hidden */
				var fighRecords = document.querySelectorAll(".fight-record." + ZOANMasterJS.currentBattleScope ); 
			    for(var i = 0; i < fighRecords.length; i++){
			        fighRecords[i].style.display = "none"; // depending on what you're doing
			    }
				
				switch(ZOANMasterJS.currentBattleScope) {
					case "today":
						ZOANMasterJS.currentBattleScope = "all";
						document.querySelector('.cylce-fight-label').innerText = "1000 FIGHTS"
						break;
					case "week":
						ZOANMasterJS.currentBattleScope = "today";
						document.querySelector('.cylce-fight-label').innerText = "LAST 24 HOURS"
						break;
					case "month":
						ZOANMasterJS.currentBattleScope = "week";
						document.querySelector('.cylce-fight-label').innerText = "LAST 7 DAYS"
						break;	
					case "all":
						ZOANMasterJS.currentBattleScope = "month";
						document.querySelector('.cylce-fight-label').innerText = "LAST 31 DAYS"
						break;	
				}
				
				
				/* replce all the statistics */
				ZOANMasterJS.loadFightHistoryStats(ZOANMasterJS.currentBattleScope)
				
				/* make sure the correct fights are displayed */
				var fighRecords = document.querySelectorAll(".fight-record." + ZOANMasterJS.currentBattleScope ); 
			    for(var i = 0; i < fighRecords.length; i++){
			        fighRecords[i].style.display = "table-row"; // depending on what you're doing
			    }
			
			} )
		}
		
	}
	
	,
	
	loadWeb3 : function() {
		
		if (this.scriptsLoaded) {
			return;
		}
		
		var jq = document.createElement('script');
	    jq.type = 'text/javascript';
	    jq.async = true;
	    jq.src = 'https://cdnjs.cloudflare.com/ajax/libs/web3/1.5.0/web3.min.js';
	    var s = document.body.getElementsByTagName('script')[0];
	    s.parentNode.insertBefore(jq, s);
	    
	    this.scriptsLoaded = true;
	}
	
	,

	loadHeader : function() {
		
		if (document.querySelector('.ZOANMasterJS')) {
			return;
		}
		

		var headerElement= document.createElement('div');
		
		var htmlTemplate = ''
		+ '<div class="ZOANMasterJS" style="background-color: #000; color:#fff;display:flex;justify-content:space-between;flex-wrap: wrap;font-family:system-ui;text-align: end;padding-right:26px;position:fixed; width:100vw;z-index:100;padding-left:2px;padding-top:4px;padding-bottom:2px; font-size:13px;">'
	
		+ '<div class="bm-col-1" style="padding-top: 0px;padding-left:5px;">'
		+ '		<span id="refresh-zoanmaster" style="color: lightgreen;margin-right: 4px;cursor: pointer;" title="Reload ZoanMasterJS">♻</span>'
		+ '		<b>ZOANMasterJS</b> '
		
		+ '		<span class="header-separator" style="margin-left:10px;margin-right:10px"> | </span>'
		
		+ '		<b>$BNB</b> <span class="bnb-price" title="Market price of BNB in USD"></span>  <span class="bnb-balance" style="color:lightgreen"></span>'
		
		+ '		<span class="header-separator" style="margin-left:10px;margin-right:10px"> | </span>'
		
		+ '		<b>$ZOON</b> <span class="zoon-price" title="Market price of zoon in USD"></span>'
		
		+ '		<span class="header-separator" style="margin-left:10px;margin-right:10px"> | </span>'
		
		+ '		<b>$YAG</b> <span class="yag-price" title="Market price of Yaki Gold in USD"></span>'
		
		+ '	</div>'
		
		+ ' <div  class="bm-col-2">'
		
		+ '		<div class="zoon-balance-container" style="display:inline-block;">'
		+ '			<b>ZOON</b>:  <span class="zoon-balance-zoon" style="color:gold"></span>  <span class="zoon-balance-usd" style="color:lightgreen"></span>  <span class="zoon-balance-bnb" style="color:lightgreen"></span>'
		+ '			<span class="header-separator" style="margin-left:10px;margin-right:10px"> | </span>'
		+ '     </div>'	
		
		+ '		<div class="yag-balance-container" style="display:inline-block;">'
		+ '			<b>YAG</b>:  <span class="yag-balance-yag" style="color:gold"></span>  <span class="yag-balance-usd" style="color:lightgreen"></span>  <span class="yag-balance-bnb" style="color:lightgreen"></span>'
		+ '			<span class="header-separator" style="margin-left:10px;margin-right:10px"> | </span>'
		+ '     </div>'
		

		+ '		<div class="bnb-balance-container" style="display:inline-block;">'
		+ '			<b>BNB</b>:  <span class="bnb-balance-bnb" style="color:lightblue"></span>  <span class="bnb-balance-usd" style="color:lightgreen"></span>  <span class="bnb-balance-zoon" style="color:lightgreen;display:none;"></span>'
		
		+ '			<span class="header-separator"  style="margin-left:10px;margin-right:10px"> | </span>'
		+ '     </div>'
		
		
		//+ '		<div class="fees-container" style="display:inline-block;">'
		//+ '			<b>FEES</b>:  '
		
		//+ '		<span class="cycle-fee-scope-back" style=""><img src="/img/earning-potential-sword.753769a3.png" class="sword-right" style="width:25px;transform: scaleX(-1);margin-left: 10px;    margin-right: -3px;    margin-left: 2px;"></span>'
		
		//+ ' 		<span class="fee-label fee-bnb" id="fee-bnb-contatiner-today" style="color:mintcream;"><span class="fee-bnb-today" style="color:lightblue"></span><span class="fee-usd-today" style="color:LIGHTSALMON"></span> <span style="font-size: 10px;margin-left: 3px;">LAST 24 HOURS</span> </span>'
		
		//+ '     	<span class="fee-labe fee-bnb" id="fee-bnb-contatiner-week" style="color:mintcream;display:none;"><span class="fee-bnb-week" style="color:lightblue"></span><span class="fee-usd-week" style="color:LIGHTSALMON"></span> <span style="font-size: 10px;margin-left: 3px;">LAST 7 DAYS</span> </span>'
		
		//+ '     	<span class="fee-label fee-bnb" id="fee-bnb-contatiner-month" style="color:mintcream;display:none"><span class="fee-bnb-month" style="color:lightblue"></span><span class="fee-usd-month" style="color:LIGHTSALMON"></span><span style="font-size: 10px;margin-left: 3px;"> LAST 31 DAYS</span> </span> '
		
		//+ '		<span class="cycle-fee-scope-forward" style="cursor:pointer;font-size: 19px;vertical-align: middle;"> ➞ </span>'
		//+ '		</div>'
		
		+ '		<div class="bnb-tip-container" style="display:none;">'		
		//	+ '     	<span class="header-separator" style="margin-left:10px;margin-right:10px"> | </span>'
		+ '     	<a class="bnb-tip"  href="#tip-ZOANMasterJS-dev"  title="Send a Tip to the ZOANMasterJS Developemnt Team!"><b>TIP <span class="recommended-bnb-tip">.01</span> BNB</b></a>'
		+ '		</div>'
		
		+ '		<div class="bnb-free-trial-counter" style="display:none;" title="Days remaining in the free ZOANMasterJS trial.">'
		+ '     <span class="header-separator"> | </span>'
		+ '     <b> <span class="dono-days-remaining"></span></b>'
		+ '		</div>'

		+ '		<div class="show-zoan-fight" style="display:none;cursor:pointer;" title="Toggle Fight History">'
		+ '     <span class="header-separator"> | </span>'
		+ '     🐣'
		+ '		</div>'
		
		+ '		<div class="show-box-stats" style="display:none;cursor:pointer;" title="Toggle Fight History">'
		+ '     <span class="header-separator"> | </span>'
		+ '     📅'
		+ '		</div>'
				
		+ '		<div class="prompt-update" style="display:none;" title="A new version of ZOANMasterJS is available now!">'
		+ '     <span class="header-separator"> | </span>'
		+ '     <b><a href="https://github.com/phoenix-tools/ZOANMasterJS/blob/master/ZOANMasterJS.js" target="_blank" style="color:lightgreen !important;">UPDATE AVAILABLE!</a></b>'
		+ '		</div>'
		
		+ '</div>'
		+ '</div>'

		+ '<style>.header-separator {margin:7px;}</style>'
		
		headerElement.innerHTML = htmlTemplate;
		var firstChild = document.body.firstChild;
		firstChild.parentNode.insertBefore(headerElement, firstChild);
		
	}
	
	,

	loadBattleHistory : function() {
		
		if (document.querySelector('.stats--container')) {
			return;
		}
		
		var battleHistoryElement= document.createElement('div');
		
		var htmlTemplate = ''

    	+ '<div class="zoanmaster-stats-container" style="">'
    	+ '	<div class="cycle-fight-history" style="display:none;">'
    	+ '		<div style="color: #f6f6f6;margin-left: auto;margin-right: auto;width: 100%;text-align: center;margin-top: 16px;background-color:rebeccapurple;">'
    	+ '			<span class="cycle-fight-stats-backward" style="cursor:pointer;">'
    	+ '				👈'
    	+ '			</span>'
    	+ '			<span class="cylce-fight-label" style="width: 139px; display: inline-block;">'
    	+ ' 			LAST 24 HOURS'
    	+ ' 		</span>'
    	+ '			<span class="cycle-fight-stats-forward" style="cursor:pointer;">'
    	+ '				👉'
    	+ '			</span>'
    	+ '		</div>'
    	+ '	</div>'
    	+ '	<div class="zoan-fight-history" style="display:none">'
    	+ '    <div class="stats--container zoans-selection" style="margin-top:3px;flex-flow: wrap;width: 100%;">'
		+ '    </div>'
		+ '	</div>'
    
    	+ '	<div class="box-stat-history" style="display:none;">'
		+ '    <div class="stats--container stats-row-1" style="">'
		+ ' 		<div class="stat--container">'
		+ '     		<div class="stat--label">OVERALL WIN PERCENTAGE</div>'
		+ '         	<div class="stat--value stat-win-percentage">0</div>'
		+ '     	</div>'
		+ '     	<div class="stat--container">'
		+ '     		<div class="stat--label">BATTLES</div>'
		+ '         	<div class="stat--value stat-battles">0</div>'
		+ '     	</div>'
		+ '     	<div class="stat--container">'
		+ '         	<div class="stat--label">WINS</div>'
		+ '     		<div class="stat--value stat-wins">0</div>'
		+ '     	</div>'
		+ '     	<div class="stat--container">'
		+ '         	<div class="stat--label">LOSSES</div>'
		+ '         	<div class="stat--value stat-losses" >0</div>'
		+ '        </div>'
		+ '     </div>'
		+'		<div class="stats--container stats-row-2" style="">'
		+ '     	<div class="stat--container">'
		+ '         	<div class="stat--label">ZOON EARNED</div>'
		+ '         	<div class="stat--value stat-tokens" style="color:gold;">.0</div>'
		+ '     	</div>'		
		+ '     	<div class="stat--container">'
		+ '         	<div class="stat--label">YAG EARNED</div>'
		+ '         	<div class="stat--value stat-yag" style="color:gold;">.0</div>'
		+ '     	</div>'
		+ '     	<div class="stat--container">'
		+ '            <div class="stat--label">FEES BNB</div>'
		+ '            <div class="stat--value stat-fees">.00 BNB</div>'
		+ '     	</div>'
		+ '     	<div class="stat--container">'
		+ '            <div class="stat--label">~PROFIT</div>'
		+ '            <div class="stat--value stat-profit"  style="color:lightgreen;">$0</div>'
		+ '     	</div>'
		+ '    </div>'
		
		+ ' 	<div class="stats--container stats-row-3" style="">'

		+ '     	<div class="stat--container">'
		+ '     		<div class="stat--label">AVERAGE ZOON / BATTLE</div>'
		+ '     		<div class="stat--value stat-average-zoon-battle" style="color:gold">0</div>'
		+ '     	</div>'
		+ '     	<div class="stat--container">'
		+ '     		<div class="stat--label">AVERAGE YAG / BATTLE</div>'
		+ '     		<div class="stat--value stat-average-yag-battle" style="color:gold">0</div>'
		+ '     	</div>'
		+ '     	<div class="stat--container">'
		+ '         	<div class="stat--label">AVERAGE EXP / BATTLE</div>'
		+ '         	<div class="stat--value stat-average-exp-battle">0</div>'
		+ '        </div>'
		+ '        <div class="stat--container">'
		+ '         	<div class="stat--label">AVERAGE FEE / BATTLE </div>'
		+ '         	<div class="stat--value stat-average-fee-battle">0</div>'
		+ '     	</div>'
		+ '     	<div class="stat--container">'
		+ '         	<div class="stat--label">AVERAGE PROFIT / BATTLE</div>'
		+ '         	<div class="stat--value stat-average-profit-battle">0</div>'
		+ '     	</div>'
		+ '    </div>'
		
		+ '    <div class="stats--container stats-row-4" style="">'
		+ '        <div class="stat--container">'
		+ '         	<div class="stat--label">AVERAGE ZOON / WIN</div>'
		+ '         	<div class="stat--value stat-average-zoon-win" style="color:gold">0</div>'
		+ '         </div>'
		+ '        <div class="stat--container">'
		+ '         	<div class="stat--label">AVERAGE YAG / WIN</div>'
		+ '         	<div class="stat--value stat-average-yag-win" style="color:gold">0</div>'
		+ '         </div>'
		+ '     	<div class="stat--container">'
		+ '         	<div class="stat--label">AVERAGE EXP / WIN</div>'
		+ '         	<div class="stat--value stat-average-exp-win" >0</div>'
		+ '     	</div>'
		+ '        <div class="stat--container">'
		+ '         	<div class="stat--label">AVERAGE FEE / WIN </div>'
		+ '         	<div class="stat--value stat-average-fee-win">0</div>'
		+ '        </div>'
		+ '        <div class="stat--container">'
		+ '         	<div class="stat--label">AVERAGE PROFIT / WIN</div>'
		+ '         	<div class="stat--value stat-average-profit-win">0</div>'
		+ '        </div>'
		+ '    </div>'
		
		
		+ '	</div>'
		+ '</div>'
		
		+ '    <style>'
		+ '        .zoanmaster-stats-container {'
		+ '     		display:none;'
		+ '     		flex-direction: column;'
		+ '				height:100vh;'
		+ '				background-color:#000;'
		+ '				padding-top: 29px;'
		+ '				position:fixed;'
		+ '				width:100vw;'
		+ '				z-index: 99;'
		+ '				overflow: scroll;'
		+ '			}'
		
		+ '        .stats--container {'
		+ '            display:flex;'
		+ '            justify-content:space-between;'
		+ '            align-items: center;'
		+ '            width:100%;'
		+ '            color: #eedba5;'
		+ '            margin-top: 20px;'
		+ '            margin-bottom: 20px;'
		+ '        }'

		+ '        .stat--container {'
		+ '           width:15%;'
		+ '        }'
		
		+ '        .stat--label {'
		+ '            line-height: 6vmin;'
		+ '            border-radius: 2px 2px 0 0;'
		+ '            background-color: rebeccapurple;'
		+ '            border-bottom: 1px solid #253246;'
		+ '            box-shadow: 0 1px 0 #495b71 inset;'
		+ '            white-space: pre;'
		+ '            width:100%;'
		+ '            text-align: center;'
		+ '            padding-top:10px;'
		+ '            padding-bottom:8px;'
		+ '            font-weight:900;'
		+ '        }'

		+ '        .stat--value {'
		+ '            background-color: rebeccapurple;'
		+ '            width: 100%;'
		+ '            text-align: center;'
		+ '            color: #d1d1d1;'
		+ '            padding-top: 20px;'
		+ '            padding-bottom: 33px;'
		+ '            font-size: 22px;'
		+ '        }'
		+ '    </style>';
		
		battleHistoryElement.innerHTML = htmlTemplate;
		var firstChild = document.body.firstChild;
		firstChild.parentNode.insertBefore(battleHistoryElement, firstChild);
		
	}
	
	,
	
	
	loadPrices : function() {
		
		if (this.marketPrices.bnb ) {
			return;
		}

		
		/* load BNB and zoon prices from Coingecko API */
		var coingeckoRequest = new XMLHttpRequest();
			
		var params = {
            vs_currency: "usd",
            ids: "binancecoin,cryptozoon,yaki-gold"
        }
        
        var apiURL = new URL("https://api.coingecko.com/api/v3/coins/markets");
        
        for (const key in params ) {
        	apiURL.searchParams.append(key , params[key]);
        }
        
                
		coingeckoRequest.open("GET", apiURL.href );
		coingeckoRequest.send();
		
		coingeckoRequest.onload = () => {
	
			ZOANMasterJS.coinGecko  = JSON.parse(coingeckoRequest.response);

			ZOANMasterJS.marketPrices.bnb = ZOANMasterJS.coinGecko[0].current_price;
			ZOANMasterJS.marketPrices.zoon = ZOANMasterJS.coinGecko[1].current_price;
			ZOANMasterJS.marketPrices.yag = ZOANMasterJS.coinGecko[2].current_price;
			
			/* set these prices into the header */
			document.querySelector('.bnb-price').innerText = "" + ZOANMasterJS.marketPrices.bnb.toFixed(3) +" "
			document.querySelector('.zoon-price').innerText = "" + ZOANMasterJS.marketPrices.zoon.toFixed(3) + " "
			document.querySelector('.yag-price').innerText = "" + ZOANMasterJS.marketPrices.yag.toFixed(3) + " "
			
			
			/* load BNB Balance and Calculate Transactions from Custom API */
			var bscscanRequest = new XMLHttpRequest();
				
			var params = {
	            ethAddress: window.ethereum.selectedAddress.toLowerCase(),
	            clientDateTime: new Date().getTime(),
	            clientTimeZoneOffset: new Date().getTimezoneOffset(),
	            product: "zoanmasterjs",
	            query: ["tokenBalance","yagBalance","bnbBalance","txFees","fights"]
	        }
	        
	        apiURL = new URL("https://phoenixtools.io/api/gamestats/");
	        
	        for (const key in params ) {
	        	apiURL.searchParams.append(key , params[key]);
	        }
	        
	                
			bscscanRequest.open("GET", apiURL.href );
			bscscanRequest.send();
			
			bscscanRequest.onload = () => {
		
				ZOANMasterJS.gameStats  = JSON.parse(bscscanRequest.response);
				
				if (!ZOANMasterJS.gameStats.dono.isDono && !ZOANMasterJS.gameStats.isWhiteListed && ZOANMasterJS.gameStats.trial.status != "active") {
					
					document.querySelector('.ZOANMasterJS').style.justifyContent = "flex-end";
					document.querySelector('.bm-col-1').style.width = "90%";
					document.querySelector('.bnb-tip-container').style.display = "inline-block";
					
					document.querySelector('.bm-col-1').innerHTML = '<div class="dono-activate-promot" style="display: contents;padding-right:10px;width:100%;"><marquee>YOOOOO! <b>ZOANMasterJS</b> costs <span style="color:gold"><b>.01 BNB</b></span> for every <b>40 days</b> of use. --------  Click the <b>TIP</b> button to the right to activate your copy!  --------  Make sure your <b>MetaMask</b> is set to the <b>Binance Smart Chain</b> before tipping!  -------- There might be a delay between tipping and asset activation depending on the speed of the bscscan.com API. If activation takes longer than an hour then please reach out on our <a href="https://discord.gg/6AjVj3s9aN" target="_blank">Discord</a> for manual assistance :) </marquee></div>';
					document.querySelector('.zoon-balance-container').parentNode.removeChild(document.querySelector('.zoon-balance-container'))
					document.querySelector('.bnb-balance-container').parentNode.removeChild(document.querySelector('.bnb-balance-container'))
					document.querySelector('.fees-container').parentNode.removeChild(document.querySelector('.fees-container'))
					return;
				} 
				else if (ZOANMasterJS.gameStats.dono.isDono || ZOANMasterJS.gameStats.isWhiteListed) {
					document.querySelector('.bnb-tip').title = "You have " + ZOANMasterJS.gameStats.dono.daysRemaining + " days until the next donation.";
					document.querySelector('.bnb-tip-container').style.display = "inline-block";
				}	
				else if (ZOANMasterJS.gameStats.trial.status == "active") {
					document.querySelector('.bnb-free-trial-counter').style.display = "inline-block";
					document.querySelector('.dono-days-remaining').innerText = ZOANMasterJS.gameStats.trial.daysRemaining + " Days ";
				}
				
				
				/* get user zoon balance, does not include staked zoon */
				ZOANMasterJS.balances.zoon = parseFloat(ZOANMasterJS.gameStats.balances.token.inETH).toFixed(2);
				ZOANMasterJS.balances.yag = parseFloat(ZOANMasterJS.gameStats.balances.yag.inETH).toFixed(2);
				ZOANMasterJS.balances.bnb = parseFloat(ZOANMasterJS.gameStats.balances.bnb.inETH).toFixed(3);
				
				/* figure out dollar balance */
				ZOANMasterJS.balances.usd_bnb =  ( parseFloat(ZOANMasterJS.balances.bnb , 8 ) * parseFloat(ZOANMasterJS.marketPrices.bnb , 8 ) ).toFixed(2);
				
				ZOANMasterJS.balances.zoon_bnb =  ( parseFloat(ZOANMasterJS.balances.usd_bnb , 8 ) / parseFloat(ZOANMasterJS.marketPrices.zoon , 8 ) ).toFixed(2);
				
				ZOANMasterJS.balances.yag_bnb =  ( parseFloat(ZOANMasterJS.balances.usd_bnb , 8 ) / parseFloat(ZOANMasterJS.marketPrices.yag , 8 ) ).toFixed(2);
						
				/* figure out zoon balance */
				ZOANMasterJS.balances.usd_zoon =  ( parseFloat(ZOANMasterJS.balances.zoon , 8 ) * parseFloat(ZOANMasterJS.marketPrices.zoon , 8 ) ).toFixed(2);
				
				ZOANMasterJS.balances.bnb_zoon =  ( parseFloat(ZOANMasterJS.balances.usd_zoon , 8 ) / parseFloat(ZOANMasterJS.marketPrices.bnb , 8 ) ).toFixed(2);
				
				/* figure out yag balance */
				ZOANMasterJS.balances.usd_yag =  ( parseFloat(ZOANMasterJS.balances.yag , 8 ) * parseFloat(ZOANMasterJS.marketPrices.yag , 8 ) ).toFixed(2);
				
				ZOANMasterJS.balances.bnb_yag =  ( parseFloat(ZOANMasterJS.balances.usd_yag , 8 ) / parseFloat(ZOANMasterJS.marketPrices.bnb , 8 ) ).toFixed(2);
			
			
				
				/* set these prices into the header */
				document.querySelector('.zoon-balance-zoon').innerText =  ZOANMasterJS.balances.zoon + " ZOON  "
				document.querySelector('.zoon-balance-usd').innerText = " +$" + ZOANMasterJS.balances.usd_zoon + " "
				document.querySelector('.zoon-balance-bnb').innerText = " +" + ZOANMasterJS.balances.bnb_zoon + "BNB "
				document.querySelector('.yag-balance-yag').innerText =  ZOANMasterJS.balances.yag + " YAG  "
				document.querySelector('.yag-balance-usd').innerText = " +$" + ZOANMasterJS.balances.usd_yag + " "
				document.querySelector('.yag-balance-bnb').innerText = " +" + ZOANMasterJS.balances.bnb_yag + "BNB "
				document.querySelector('.bnb-balance-bnb').innerText =  ZOANMasterJS.balances.bnb + " BNB  "
				document.querySelector('.bnb-balance-usd').innerText = " +$" + ZOANMasterJS.balances.usd_bnb + " "
				document.querySelector('.bnb-balance-zoon').innerText = " +" + ZOANMasterJS.balances.zoon_bnb + " ZOON "
				
				/* calculate fee bnb cost in USD */
				//var feesTodayUSD = ZOANMasterJS.gameStats.txFees.today * ZOANMasterJS.marketPrices.bnb;
				//var feesWeekUSD = ZOANMasterJS.gameStats.txFees.thisWeek * ZOANMasterJS.marketPrices.bnb;
				//var feesMonthUSD = ZOANMasterJS.gameStats.txFees.thisMonth * ZOANMasterJS.marketPrices.bnb;
				
				/* add day fees to UI */
				//document.querySelector('.fee-bnb-today').innerText = parseFloat(ZOANMasterJS.gameStats.txFees.today).toFixed(3) + " BNB "
				//document.querySelector('.fee-usd-today').innerText = " ($"+ parseFloat(feesTodayUSD).toFixed(2) + ") "
				
				/* add week fees to UI */
				//document.querySelector('.fee-bnb-week').innerText =  parseFloat(ZOANMasterJS.gameStats.txFees.thisWeek).toFixed(3) + " BNB "
				//document.querySelector('.fee-usd-week').innerText =  " ($"+ parseFloat(feesWeekUSD).toFixed(2) + ") "
				
				/* add month fees to UI */
				//document.querySelector('.fee-bnb-month').innerText =  parseFloat(ZOANMasterJS.gameStats.txFees.thisMonth).toFixed(3) + " BNB "
				//document.querySelector('.fee-usd-month').innerText =   " ($"+ parseFloat(feesMonthUSD).toFixed(2) + ") "
				
			
				/* Calculate Fight History Stats */
				ZOANMasterJS.loadFightHistoryStats(ZOANMasterJS.currentBattleScope)
				
				/* asset is ready to show stats */
				document.querySelector('.show-box-stats').style.display = "inline-block";
			};
		
		};

	}

	,

	/**
	 *
	 */
	 loadFightHistoryStats: function( period ) {

		document.querySelector('.stat-battles').innerText = ZOANMasterJS.gameStats.fights[period].totalFights;
		document.querySelector('.stat-wins').innerText = ZOANMasterJS.gameStats.fights[period].wins;
		document.querySelector('.stat-losses').innerText = ZOANMasterJS.gameStats.fights[period].losses;

		/* get market value of zoon */
		var marketTokens = ZOANMasterJS.marketPrices.zoon * ZOANMasterJS.gameStats.fights[period].tokenGains;
		document.querySelector('.stat-tokens').innerText = ZOANMasterJS.gameStats.fights[period].tokenGains.toFixed(2) + ' ($' + marketTokens.toFixed(2) +')';
		
		/* get market value of yag */
		var marketYag = ZOANMasterJS.marketPrices.yag * ZOANMasterJS.gameStats.fights[period].yagGains;
		document.querySelector('.stat-yag').innerText = ZOANMasterJS.gameStats.fights[period].yagGains.toFixed(2) + ' ($' + marketYag.toFixed(2) +')';
		
		/* get market value of fees */
		var marketBNB = ZOANMasterJS.marketPrices.bnb * ZOANMasterJS.gameStats.fights[period].fees;
		document.querySelector('.stat-fees').innerText = ZOANMasterJS.gameStats.fights[period].fees.toFixed(3) + ' ($' + marketBNB.toFixed(2) +')';
		
		/* subtract the two for profit */
		var profit = marketTokens + marketYag- marketBNB;
		
		if (profit < 0 ) {
			document.querySelector('.stat-profit').style.color = "tomato"; 
			document.querySelector('.stat-profit').innerText = '-$' + profit.toFixed(2).replace('-','');
		} else {
			document.querySelector('.stat-profit').style.color = "chartreuse";
			document.querySelector('.stat-profit').innerText = '$' + profit.toFixed(2);
		}
		
		/* get win percentage */
		if (!ZOANMasterJS.gameStats.fights[period].totalFights) {
			document.querySelector('.stat-win-percentage').innerText = "0%"; 
		} else {
			var winPercentage =  ( ZOANMasterJS.gameStats.fights[period].wins / ZOANMasterJS.gameStats.fights[period].totalFights ) * 100;
			document.querySelector('.stat-win-percentage').innerText = winPercentage.toFixed(0) + "%";
			
			if (winPercentage > 50 ) {
				document.querySelector('.stat-win-percentage').style.color = "chartreuse";
			} else {
				document.querySelector('.stat-win-percentage').style.color = "tomato";
			}
		}
		
		/* get average EXP */
		if (!ZOANMasterJS.gameStats.fights[period].expGains) {
			document.querySelector('.stat-average-zoon-battle').innerText = "0"; 
			document.querySelector('.stat-average-zoon-win').innerText = "0"; 
			document.querySelector('.stat-average-yag-battle').innerText = "0"; 
			document.querySelector('.stat-average-yag-win').innerText = "0"; 
		} else {
			/* per battle */
			var averageExpGains =  ( ZOANMasterJS.gameStats.fights[period].expGains / ZOANMasterJS.gameStats.fights[period].totalFights )
			document.querySelector('.stat-average-exp-battle').innerText = averageExpGains.toFixed(2) + ' EXP';
			
			/* per win */
			var averageExpGains =  ( ZOANMasterJS.gameStats.fights[period].winData.expGains / ZOANMasterJS.gameStats.fights[period].wins )
			document.querySelector('.stat-average-exp-win').innerText = averageExpGains.toFixed(2) + ' EXP';
		}
		
		/* get average ZOON */
		if (!ZOANMasterJS.gameStats.fights[period].tokenGains && !ZOANMasterJS.gameStats.fights[period].yagGains) {
			document.querySelector('.stat-average-zoon-battle').innerText = "0"; 
			document.querySelector('.stat-average-zoon-win').innerText = "0"; 
			document.querySelector('.stat-average-yag-battle').innerText = "0"; 
			document.querySelector('.stat-average-yag-win').innerText = "0"; 
		} else {
			
			/* per battle */
			var averageTokenGains =  ( ZOANMasterJS.gameStats.fights[period].tokenGains / ZOANMasterJS.gameStats.fights[period].totalFights )
			var marketAverageTokenGains = ZOANMasterJS.marketPrices.zoon * averageTokenGains;
			document.querySelector('.stat-average-zoon-battle').innerText = averageTokenGains.toFixed(2) + ' ($'+marketAverageTokenGains.toFixed(2)+')';
			
			var averageYagGains =  ( ZOANMasterJS.gameStats.fights[period].yagGains / ZOANMasterJS.gameStats.fights[period].totalFights )
			var marketAverageYagGains = ZOANMasterJS.marketPrices.yag * averageYagGains;
			document.querySelector('.stat-average-yag-battle').innerText = averageYagGains.toFixed(2) + ' ($'+marketAverageYagGains.toFixed(2)+')';
			
			
			/* per win */
			var averageTokenGains =  ( ZOANMasterJS.gameStats.fights[period].winData.tokenGains / ZOANMasterJS.gameStats.fights[period].wins )
			var marketAverageTokenGains = ZOANMasterJS.marketPrices.zoon * averageTokenGains;
			document.querySelector('.stat-average-zoon-win').innerText = averageTokenGains.toFixed(2) + ' ($'+marketAverageTokenGains.toFixed(2)+')';
			
			
			var averageYagGains =  ( ZOANMasterJS.gameStats.fights[period].winData.yagGains / ZOANMasterJS.gameStats.fights[period].wins )
			var marketAverageYagGains = ZOANMasterJS.marketPrices.yag * averageYagGains;
			document.querySelector('.stat-average-yag-win').innerText = averageYagGains.toFixed(2) + ' ($'+marketAverageYagGains.toFixed(2)+')';
		}
		
		/* get average fee */
		if (!ZOANMasterJS.gameStats.fights[period].fees) {
			document.querySelector('.stat-average-fee-battle').innerText = "0"; 
			document.querySelector('.stat-average-fee-win').innerText = "0"; 
		} else {
			/* per battle */
			var averageFees =  ( ZOANMasterJS.gameStats.fights[period].fees / ZOANMasterJS.gameStats.fights[period].totalFights )
			var marketAverageFees = ZOANMasterJS.marketPrices.bnb * averageFees;
			document.querySelector('.stat-average-fee-battle').innerText = averageFees.toFixed(4) + ' ($'+marketAverageFees.toFixed(2)+')';
			
			/* per win */
			var averageFees =  ( ZOANMasterJS.gameStats.fights[period].winData.fees / ZOANMasterJS.gameStats.fights[period].wins )
			var marketAverageFees = ZOANMasterJS.marketPrices.bnb * averageFees;
			document.querySelector('.stat-average-fee-win').innerText = averageFees.toFixed(4) + ' ($'+marketAverageFees.toFixed(2)+')';
		}
		
		/* get average profit */
		if (!profit) {
			document.querySelector('.stat-average-profit-battle').innerText = "0"; 
			document.querySelector('.stat-average-profit-win').innerText = "0"; 
		} else {
			var averageProfitBattle =  ( profit / ZOANMasterJS.gameStats.fights[period].totalFights )
			var averageProfitWins =  ( profit / ZOANMasterJS.gameStats.fights[period].wins )

			
			if (averageProfitBattle < 0 ) {
				document.querySelector('.stat-average-profit-battle').innerText = '-$' + averageProfitBattle.toFixed(2).replace('-','');
				document.querySelector('.stat-average-profit-battle').style.color = "tomato"; 
			} else {
				document.querySelector('.stat-average-profit-battle').innerText = '$' + averageProfitBattle.toFixed(2)
				document.querySelector('.stat-average-profit-battle').style.color = "lightgreen"; 
			}
			
			if (averageProfitWins < 0 ) {
				document.querySelector('.stat-average-profit-win').innerText = '-$' + averageProfitWins.toFixed(2).replace('-','');
				document.querySelector('.stat-average-profit-win').style.color = "tomato"; 
			} else {
				document.querySelector('.stat-average-profit-win').innerText = '$' + averageProfitWins.toFixed(2)
				document.querySelector('.stat-average-profit-win').style.color = "lightgreen"; 
			}
		}
		
		
		
		
		/* load NFT Battle history */
		if (Object.keys(ZOANMasterJS.zoans).length == 0) {
			return;
		}
		
		for( var [key,value] of Object.entries(ZOANMasterJS.gameStats.fights.nfts)) {
			
			var winPercentage = "0%";
			if (ZOANMasterJS.gameStats.fights.nfts[key][ZOANMasterJS.currentBattleScope].totalFights) {
				var winPercentage = ( ZOANMasterJS.gameStats.fights.nfts[key][ZOANMasterJS.currentBattleScope].wins / ZOANMasterJS.gameStats.fights.nfts[key][ZOANMasterJS.currentBattleScope].totalFights ) * 100;
				if (winPercentage < 50 ) {
					winPercentage = '<span style="color:lightgreen;">' + winPercentage.toFixed(1) + '%</span>';
				} else {
					winPercentage= '<span style="color:chartreuse;">' + winPercentage.toFixed(1) + '%</span>';
				}
			}
			
			/* get market value of tokens */
			var marketTokens = ZOANMasterJS.marketPrices.zoon * ZOANMasterJS.gameStats.fights.nfts[key][ZOANMasterJS.currentBattleScope].tokenGains;
		
			/* get market value of yag */
			var marketYag = ZOANMasterJS.marketPrices.yag * ZOANMasterJS.gameStats.fights.nfts[key][ZOANMasterJS.currentBattleScope].yagGains;
	
			/* get market value of fees */
			var marketBNB = ZOANMasterJS.marketPrices.bnb * ZOANMasterJS.gameStats.fights.nfts[key][ZOANMasterJS.currentBattleScope].fees;
			var fees = ZOANMasterJS.gameStats.fights.nfts[key][ZOANMasterJS.currentBattleScope].fees.toFixed(2) + ' ($' + marketBNB.toFixed(2) +')';
			
			/* subtract the two for profit */
			var profit = marketTokens + marketYag - marketBNB;
			
			if (profit < 0 ) {
				profit = '<span style="color:tomato;">-$' + profit.toFixed(2).replace('-','') + '</span>';
			} else {
				profit= '<span style="color:chartreuse;">$' + profit.toFixed(2) + '</span>';
			}
			
			document.getElementById(key + '-fights').innerText = ZOANMasterJS.gameStats.fights.nfts[key][ZOANMasterJS.currentBattleScope].totalFights;
			document.getElementById(key + '-winPercentage').innerHTML = winPercentage;
			document.getElementById(key + '-expGains').innerText = ZOANMasterJS.gameStats.fights.nfts[key][ZOANMasterJS.currentBattleScope].expGains.toFixed(0);
			document.getElementById(key + '-wins').innerText = ZOANMasterJS.gameStats.fights.nfts[key][ZOANMasterJS.currentBattleScope].wins;
			document.getElementById(key + '-losses').innerText = ZOANMasterJS.gameStats.fights.nfts[key][ZOANMasterJS.currentBattleScope].losses;
			document.getElementById(key + '-tokens').innerText = ZOANMasterJS.gameStats.fights.nfts[key][ZOANMasterJS.currentBattleScope].tokenGains.toFixed(0);
			document.getElementById(key + '-yag').innerText = ZOANMasterJS.gameStats.fights.nfts[key][ZOANMasterJS.currentBattleScope].yagGains.toFixed(0);
			document.getElementById(key + '-fees').innerHTML = fees;
			document.getElementById(key + '-profit').innerHTML = profit;
			
		
		}
	}
	
	,
	
	readZones : function() {
		
		var zoanCards = document.querySelectorAll('.card-zoan.fight-monster');
		
		if (zoanCards.length == 0 ) {
			zoanCards = document.querySelectorAll('.card-zoan.my-zoan');
		}
		
		zoanCards.forEach(function(card) {
			var zoanID = card.querySelector('.zoan-id .badge-pill').innerText.replace("#" , "");
			
			ZOANMasterJS.zoans[zoanID] = {}
			ZOANMasterJS.zoans[zoanID].image =  card.querySelector('img').src;
			ZOANMasterJS.zoans[zoanID].name =  card.querySelector('.card-header').innerText;
			
			/* loop through row stats */
			var table  = card.querySelector('.zoan-statis');

			var tds = table.querySelectorAll('td')
			tds.forEach(function(td) {
				var text = td.innerText;
				var parts = text.split(':');
				ZOANMasterJS.zoans[zoanID][parts[0].trim()] = parts[1].trim();
			});
		});
		
		if (zoanCards.length <1 ) {
			return;
		}
		
		if (document.querySelector('.zoanmaster-zoan-card')) {
			return;
		}
		
		if (typeof ZOANMasterJS.gameStats.fights  == "undefined" ) {
			return;
		}
		
		/* asset is ready to show stats */
		document.querySelector('.show-zoan-fight').style.display = "inline-block";
		
		/* loop through zoans and create Zoan selection inside of the fight history */
		zoanCardsHTML = '<style>'
					+'		.zm-right .td-value {'  
					+'			height: 58px;'
			    	+'			vertical-align: bottom;'
			    	+'			font-size: 16px;'
			    	+'			max-width: 162px;'
			    	+'			min-width: 100px;'
					+'		}'
					+'	</style>';
		for( var [key,value] of Object.entries(ZOANMasterJS.gameStats.fights.nfts)) {
			
			var winPercentage = "0%";
			if (ZOANMasterJS.gameStats.fights.nfts[key][ZOANMasterJS.currentBattleScope].totalFights) {
				var winPercentage = ( ZOANMasterJS.gameStats.fights.nfts[key][ZOANMasterJS.currentBattleScope].wins / ZOANMasterJS.gameStats.fights.nfts[key][ZOANMasterJS.currentBattleScope].totalFights ) * 100;
				if (winPercentage < 0 ) {
					winPercentage = '<span style="color:lightgreen;">' + winPercentage.toFixed(1) + '%</span>';
				} else {
					winPercentage= '<span style="color:chartreuse;">' + winPercentage.toFixed(1) + '%</span>';
				}
			}
			
			/* get market value of tokens */
			var marketTokens = ZOANMasterJS.marketPrices.zoon * ZOANMasterJS.gameStats.fights.nfts[key][ZOANMasterJS.currentBattleScope].tokenGains;
	
			
			/* get market value of tokens */
			var marketYag = ZOANMasterJS.marketPrices.yag * ZOANMasterJS.gameStats.fights.nfts[key][ZOANMasterJS.currentBattleScope].yagGains;
	
			/* get market value of fees */
			var marketBNB = ZOANMasterJS.marketPrices.bnb * ZOANMasterJS.gameStats.fights.nfts[key][ZOANMasterJS.currentBattleScope].fees;
			var fees = ZOANMasterJS.gameStats.fights.nfts[key][ZOANMasterJS.currentBattleScope].fees.toFixed(2) + ' ($' + marketBNB.toFixed(2) +')';
			
			/* subtract the two for profit */
			var profit = marketTokens + marketYag - marketBNB;
			
			if (profit < 0 ) {
				profit = '<span style="color:tomato;">-$' + profit.toFixed(2).replace('-','') + '</span>';
			} else {
				profit= '<span style="color:chartreuse;">$' + profit.toFixed(2) + '</span>';
			}
			
			zoanCardsHTML = zoanCardsHTML + ''
			+'<div class="card-zoan card zoanmaster-zoan-card" id="zoanmaster-'+key+'" style="width:100%; background-color: indigo; margin-bottom: 3px; display: inline-table;border-radius: 5px;">'
			+'		<div class="" style="display:flex;flex:1;min-height:auto !important;">'
			+'			<div class="zm-left" style="width:14vw;top: -9px;position: relative;left:-40px;">'
			
			+'				<span class="badge badge-primary badge-pill" style="position: relative;right: -100px;width: auto;top: 6px;">#'+key+'</span>'
			+'				<img src="'+ZOANMasterJS.zoans[key].image+'" style="width:140px">'
			+'			</div>'
			+'			<div class="zm-right" style="width: 81%;  text-align: right;padding-top:21px !important;">'
			+'				<table style="width:100%;  text-align: center;">'
			+'					<tr>'
			+'						<th>'
			+'							WIN %'
			+'						</th>'
			+'						<th>'
			+'							RARITY'
			+'						</th>'
			+'						<th>'
			+'							LEVEL'
			+'						</th>'
			+'						<th>'
			+'							CLASS'
			+'						</th>'
			+'						<th>'
			+'							FIGHTS'
			+'						</th>'
			+'						<th>'
			+'							WINS'
			+'						</th>'
			+'						<th>'
			+'							LOSSES'
			+'						</th>'
			+'						<th>'
			+'							EXP GAINS'
			+'						</th>'
			+'						<th>'
			+'							ZOON'
			+'						</th>'
			+'						<th>'
			+'							YAG'
			+'						</th>'
			+'						<th>'
			+'							FEES'
			+'						</th>'
			+'						<th>'
			+'							PROFIT'
			+'						</th>'
			+'					</tr>'
			+'					<tr>'
			+'						<td class="td-value">'
			+'							<span id="'+key+'-winPercentage">'+winPercentage+'</span>'
			+'						</td>'
			+'						<td class="td-value">'
			+'							<span id="'+key+'-rare">'+ZOANMasterJS.zoans[key].Rare+'</span>'
			+'						</td>'
			+'						<td class="td-value">'
			+'							<span id="'+key+'-level">'+ZOANMasterJS.zoans[key].Level+'</span>'
			+'						</td>'
			+'						<td class="td-value">'
			+'							<span id="'+key+'-class">'+ZOANMasterJS.zoans[key].Class+'</span>'
			+'						</td>'

			+'						<td class="td-value">'
			+'							<span id="'+key+'-fights">'+ZOANMasterJS.gameStats.fights.nfts[key].today.totalFights+'</span>'
			+'						</td>'

			+'						<td class="td-value">'
			+'							<span id="'+key+'-wins">'+ZOANMasterJS.gameStats.fights.nfts[key].today.wins+'</span>'
			+'						</td>'

			+'						<td class="td-value">'
			+'							<span id="'+key+'-losses">'+ZOANMasterJS.gameStats.fights.nfts[key].today.losses+'</span>'
			+'						</td>'
		

			+'						<td class="td-value">'
			+'							<span id="'+key+'-expGains">'+ZOANMasterJS.gameStats.fights.nfts[key].today.expGains+'</span>'
			+'						</td>'
			
			+'						<td class="td-value" style="color: gold;">'
			+'							<span id="'+key+'-tokens">'+ZOANMasterJS.gameStats.fights.nfts[key].today.tokenGains.toFixed(2)+'</span>'
			+'						</td>'
			
			+'						<td class="td-value" style="color: gold;">'
			+'							<span id="'+key+'-yag">'+ZOANMasterJS.gameStats.fights.nfts[key].today.yagGains.toFixed(2)+'</span>'
			+'						</td>'

			+'						<td class="td-value" style="color: darkgray;">'
			+'							<span id="'+key+'-fees">'+fees+'</span>'
			+'						</td>'

			+'						<td class="td-value">'
			+'							<span id="'+key+'-profit">'+profit+'</span>'
			+'						</td>'
			+'					</tr>'
			+'				</table>'
			+'			</div >'
			+'		</div>'
			+'</div>'
			
			
		};
		
		/* loop through fights and create zoan fight history table */
		zoanCardsHTML = zoanCardsHTML + ''
		+'<div class="zoanmaster-zoan-fight-card" id="zoanmaster-fight-record-'+key+'" style="width:100%; background-color: indigo; margin-bottom: 3px; display: inline-table;border-radius: 5px;margin-top:20px;">'
		+'		<div class="" style="display:flex;flex:1;min-height:auto !important;">'
		+'			<table style="width:100%;  text-align: center;">'
		+'				<tr style="    background-color: rebeccapurple;">'
		+'					<th>'
		+'						DATE'
		+'					</th>'
		+'					<th>'
		+'						ZOAN ID'
		+'					</th>'
		+'					<th>'
		+'						MONSTER LEVEL'
		+'					</th>'
		+'					<th>'
		+'						RESULT'
		+'					</th>'
		+'					<th>'
		+'						ZOON'
		+'					</th>'
		+'					<th>'
		+'						YAG'
		+'					</th>'
		+'					<th>'
		+'						FEE'
		+'					</th>'
		+'					<th>'
		+'						PROFIT'
		+'					</th>'
		+'				</tr>';
		
		var fights = Object.keys(Object.entries(ZOANMasterJS.gameStats.fights.records)).reverse();

		fights.forEach(function(fightKey) {
			
			var fight = ZOANMasterJS.gameStats.fights.records[fightKey];
			
			var date = new Date(fight.timeStamp * 1000).toLocaleTimeString([], {year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit'});
			
			var win = (fight.win) ? "<span style='color:lightgreen;background-color: lightgreen;padding-left: 20px;padding-right: 20px;padding-top: 3px;padding-bottom: 3px;color: #605eb6;border-radius: 3px;'>WIN</span>" :  "<span style=''>LOSS</span>"
			

			/* get market value of tokens */
			var marketTokens = ZOANMasterJS.marketPrices.zoon * fight.token;
			
			/* get market value of yag */
			var marketYag = ZOANMasterJS.marketPrices.yag * fight.yag;
			
			/* get market value of fees */
			var marketBNB = ZOANMasterJS.marketPrices.bnb * fight.feeBnb;
		
			/* subtract the two for profit */
			var profit = marketTokens + marketYag- marketBNB;
			
			if (profit < 0 ) {
				profit = '<span style="color:darkgray;">-$' + profit.toFixed(2).replace('-','') + '</span>';
			} else {
				profit= '<span style="color:chartreuse;font-weight:900;">$' + profit.toFixed(2) + '</span>';
			}
			
			var bgcolor = (fightKey % 2) ? "#530b9b" : "indigo";
			
			zoanCardsHTML = zoanCardsHTML + ''
			
			+'					<tr style="background-color:'+bgcolor+';display:none;" class="fight-record '+fight.sortClass+'">'
			+'						<td style="padding-top: 10px;padding-bottom: 10px;">'
			+'							<span id="'+key+'-winPercentage">'+date+'</span>'
			+'						</td>'
			+'						<td style="padding-top: 10px;padding-bottom: 10px;">'
			+'							<span id="'+key+'-rare">'+fight.zoanId+'</span>'
			+'						</td>'
			+'						<td style="padding-top: 10px;padding-bottom: 10px;">'
			+'							<span id="'+key+'-level">'+ parseInt(fight.enemyLevel + 1)+'</span>'
			+'						</td>'
			+'						<td style="padding-top: 10px;padding-bottom: 10px;">'
			+'							<span id="'+key+'-class">'+win+'</span>'
			+'						</td>'
			+'						<td style="padding-top: 10px;padding-bottom: 10px;color:gold;font-weight:600;">'
			+'							<span id="'+key+'-token">'+fight.token.toFixed(2)+'</span>'
			+'						</td>'
			+'						<td style="padding-top: 10px;padding-bottom: 10px;color:gold;font-weight:600;">'
			+'							<span id="'+key+'-yag">'+fight.yag.toFixed(2)+'</span>'
			+'						</td>'
			+'						<td style="padding-top: 10px;padding-bottom: 10px;">'
			+'							<span id="'+key+'-wins">'+fight.feeBnb+'</span>'
			+'						</td>'

			+'						<td style="padding-top: 10px;padding-bottom: 10px;">'
			+'							<span id="'+key+'-losses">'+profit+'</span>'
			+'						</td>'
			+'					</tr>';
		});
		
		zoanCardsHTML = zoanCardsHTML + ''
		+'				</table>'
		+'		</div>'
		+'</div>'
	
		document.querySelector('.zoans-selection').innerHTML = zoanCardsHTML;
	}
	
	,
	
	checkForUpdates : function() {
	
		var gitHubRequest = new XMLHttpRequest();
        var apiURL = new URL("https://api.github.com/repos/phoenix-tools/ZOANMasterJS/tags");
        
        
		gitHubRequest.open("GET", apiURL.href );
		gitHubRequest.send();
		
		gitHubRequest.onload = () => {
			ZOANMasterJS.gitHub  = JSON.parse(gitHubRequest.response);
			var latestRelease = ZOANMasterJS.gitHub[0];
			var latestVersion = latestRelease.name
			
			var updateReady = ZOANMasterJS.version.localeCompare(latestVersion, undefined, { numeric: true, sensitivity: 'base' })  

			if (updateReady < 0 ){
				document.querySelector('.prompt-update').style.display ="inline-block"
			}
		}
	}
	
	, 
	
}

setTimeout(function() {
	
	setInterval(function() {
		//document.querySelector('.z-header').style = "background-color:#000 !important;"
		document.querySelector('.container').style = "max-width:100%;padding:0px;"
		document.querySelector('.z').style.top = ZOANMasterJS.topOffet;
		document.querySelector('.z').style.position = "relative"
		document.querySelector('.z-header').style.position = "fixed";
		document.querySelector('.z-header').style.width = "100vw";
		document.querySelector('.z-header').style.zIndex = "85";
		document.querySelector('.z-body').style.position = "relative";
		document.querySelector('.z-body').style.top = "100px";
	} , 500 )
	
	document.querySelector('body').style.backgroundColor = "#000";
	
	ZOANMasterJS.init();
	ZOANMasterJS.checkForUpdates();
	
} , 2000 )