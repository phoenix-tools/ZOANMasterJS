/**
 * 
 * @title ZOANMasterJS.js
 * @description Welcome ZOANMasterJS! ZOANMasterJS is a JS class that enhances the app.cryptozoon.io UX experience while also offering an edge to battle
 * 
 * @ver 2.2.2
 * @author: phoenixtools
 * @contributors: Hudson Atwell
 */
 
 var ZOANMasterJS = {
    
	version: "2.2.2",
    scriptsLoaded : false,
	balances : {},
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
		
		setTimeout(function(dm) {
			if (!window.ethereum.selectedAddress) {
				return true;
			}
			dm.loadPrices();
		} , 600 , this );
		
		this.intervals.listeners = setInterval(function( dm ) {
			dm.loadListeners();
		}, 500 , this )
		
	}
	
	,
	
	destroyCurrentInstance : function() {
		
		/* remove header */
		document.querySelector('.ZOANMasterJS').parentNode.removeChild(document.querySelector('.ZOANMasterJS'));
			
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
		 if (document.querySelector('.show-fight') && !ZOANMasterJS.listeners.showFights) {

			ZOANMasterJS.listeners.showFights = true;
			ZOANMasterJS.listeners.row2 = false;
			ZOANMasterJS.listeners.row3 = false;
				
			document.querySelector('.show-fight').addEventListener('click', function() {
				var fightHistory = document.querySelector('.fight-history');
				var row1 = document.querySelector('.stats-row-1');
				var row2 = document.querySelector('.stats-row-2');
				var row3 = document.querySelector('.stats-row-3');
				
				
				if (window.getComputedStyle(fightHistory).display == "none") {
					fightHistory.style.display = "flow-root";
					fightHistory.style.height = "100vh";
					ZOANMasterJS.topOffet = "100vh";
				}
				else if (!ZOANMasterJS.listeners.row2) {
					row2.style.display = "flex"
					ZOANMasterJS.listeners.row2 = true;
					
				}
				else if (!ZOANMasterJS.listeners.row3) {
					row3.style.display = "flex"
					ZOANMasterJS.listeners.row3 = true;
					
				}
				else {
					fightHistory.style.display = "none";
					row2.style.display = "none";
					row3.style.display = "none";
					ZOANMasterJS.listeners.row2 = false;
					ZOANMasterJS.listeners.row3 = false;
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
			
			} )
		}
		
		
		/**
		 * Cycle the fight stats backwards
		 */
		if (document.querySelector('.cycle-fight-stats-backward')  && !ZOANMasterJS.listeners.battleScopeBackward) {
			
			
			ZOANMasterJS.listeners.battleScopeBackward = true;
			
			/* listen for TIP ZOON event */
			document.querySelector('.cycle-fight-stats-backward').addEventListener('click', function() {
				
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
	
		+ '<div class="bm-col-1" style="padding-top: 5px;padding-left:5px;">'
		+ '		<b>ZOANMasterJS</b> '
		
		+ '		<span class="header-separator" style="margin-left:10px;margin-right:10px"> | </span>'
		
		+ '		<b>$BNB</b> <span class="bnb-price" title="Market price of BNB in USD"></span>  <span class="bnb-balance" style="color:lightgreen"></span>'
		
		+ '		<span class="header-separator" style="margin-left:10px;margin-right:10px"> | </span>'
		
		+ '		<b>$ZOON</b> <span class="zoon-price" title="Market price of zoon in USD"></span>'
		
		+ '	</div>'
		
		+ ' <div  class="bm-col-2">'
		
		+ '		<div class="zoon-ballance-container" style="display:inline-block;">'
		+ '			<b>ZOON</b>:  <span class="zoon-balance-zoon" style="color:gold"></span>  <span class="zoon-balance-usd" style="color:lightgreen"></span>  <span class="zoon-balance-bnb" style="color:lightgreen"></span>'
		+ '			<span class="header-separator" style="margin-left:10px;margin-right:10px"> | </span>'
		+ '     </div>'
		

		+ '		<div class="bnb-ballance-container" style="display:inline-block;">'
		+ '			<b>BNB</b>:  <span class="bnb-balance-bnb" style="color:lightblue"></span>  <span class="bnb-balance-usd" style="color:lightgreen"></span>  <span class="bnb-balance-zoon" style="color:lightgreen"></span>'
		
		+ '			<span class="header-separator"  style="margin-left:10px;margin-right:10px"> | </span>'
		+ '     </div>'
		
		
		+ '		<div class="fees-container" style="display:inline-block;">'
		+ '			<b>FEES</b>:  '
		
		//+ '		<span class="cycle-fee-scope-back" style=""><img src="/img/earning-potential-sword.753769a3.png" class="sword-right" style="width:25px;transform: scaleX(-1);margin-left: 10px;    margin-right: -3px;    margin-left: 2px;"></span>'
		
		+ ' 		<span class="fee-label fee-bnb" id="fee-bnb-contatiner-today" style="color:mintcream;"><span class="fee-bnb-today" style="color:lightblue"></span><span class="fee-usd-today" style="color:LIGHTSALMON"></span> <span style="font-size: 10px;margin-left: 3px;">LAST 24 HOURS</span> </span>'
		
		+ '     	<span class="fee-labe fee-bnb" id="fee-bnb-contatiner-week" style="color:mintcream;display:none;"><span class="fee-bnb-week" style="color:lightblue"></span><span class="fee-usd-week" style="color:LIGHTSALMON"></span> <span style="font-size: 10px;margin-left: 3px;">LAST 7 DAYS</span> </span>'
		
		+ '     	<span class="fee-label fee-bnb" id="fee-bnb-contatiner-month" style="color:mintcream;display:none"><span class="fee-bnb-month" style="color:lightblue"></span><span class="fee-usd-month" style="color:LIGHTSALMON"></span><span style="font-size: 10px;margin-left: 3px;"> LAST 31 DAYS</span> </span> '
		
		+ '		<span class="cycle-fee-scope-forward" style="cursor:pointer;font-size: 19px;vertical-align: middle;"> ➞ </span>'
		
		+ '     <span class="header-separator" style="margin-left:10px;margin-right:10px"> | </span>'
		+ '		</div>'
		
		+ '		<div class="bnb-tip-container" style="display:none;">'
		+ '     <a class="bnb-tip"  href="#tip-ZOANMasterJS-dev"  title="Send a Tip to the ZOANMasterJS Developemnt Team!"><b>TIP <span class="recommended-bnb-tip">.01</span> BNB</b></a>'
		+ '     <span class="header-separator"> | </span>'
		+ '		</div>'
		
		+ '		<div class="bnb-free-trial-counter" style="display:none;" title="Days remaining in the free ZOANMasterJS trial.">'
		+ '     <b> <span class="dono-days-remaining"></span></b>'
		+ '     <span class="header-separator"> | </span>'
		+ '		</div>'

		+ '		<div class="show-fight" style="display:inline-block;cursor:pointer;" title="Toggle Fight History">'
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

    	+ '	<div class="fight-history" style="">'
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
    
		+ '    <div class="stats--container stats-row-1" style="">'
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
		+ '     	<div class="stat--container">'
		+ '         	<div class="stat--label">ZOON EARNED</div>'
		+ '         	<div class="stat--value stat-tokens" style="color:gold;">.0</div>'
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
		
		+ ' 	<div class="stats--container stats-row-2" style=" display:none;">'
		+ ' 		<div class="stat--container">'
		+ '     		<div class="stat--label">WIN PERCENTAGE</div>'
		+ '         	<div class="stat--value stat-win-percentage">0</div>'
		+ '     	</div>'
		+ '     	<div class="stat--container">'
		+ '     		<div class="stat--label">AVERAGE ZOON / BATTLE</div>'
		+ '     		<div class="stat--value stat-average-zoon-battle" style="color:gold">0</div>'
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
		
		+ '    <div class="stats--container stats-row-3" style=" display:none;">'
		+ '        <div class="stat--container">'
		+ '         	<div class="stat--label">AVERAGE ZOON / WIN</div>'
		+ '         	<div class="stat--value stat-average-zoon-win" style="color:gold">0</div>'
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
		
		
		+ '</div>'
		+ '    <style>'
		+ '        .fight-history {'
		+ '     		display:none;'
		+ '				height:100vh;'
		+ '				background-color:#000;'
		+ '				padding-top: 29px;'
		+ '				position:fixed;'
		+ '				width:100vw;'
		+ '				z-index: 99;'
		+ '			}'
		
		+ '        .stats--container {'
		+ '            display:flex;'
		+ '            justify-content:space-evenly;'
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
		+ '            background-color: #323f53;'
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
		+ '            background-color: #2b3847;'
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
            ids: "binancecoin,cryptozoon"
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
			
			/* set these prices into the header */
			document.querySelector('.bnb-price').innerText = "" + ZOANMasterJS.marketPrices.bnb +" "
			document.querySelector('.zoon-price').innerText = "" + ZOANMasterJS.marketPrices.zoon + " "
			
			
			/* load BNB Balance and Calculate Transactions from Custom API */
			var bscscanRequest = new XMLHttpRequest();
				
			var params = {
	            ethAddress: window.ethereum.selectedAddress.toLowerCase(),
	            clientDateTime: new Date().getTime(),
	            clientTimeZoneOffset: new Date().getTimezoneOffset(),
	            product: "zoanmasterjs",
	            query: ["tokenBalance","bnbBalance","txFees","fights"]
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
					document.querySelector('.zoon-ballance-container').parentNode.removeChild(document.querySelector('.zoon-ballance-container'))
					document.querySelector('.bnb-ballance-container').parentNode.removeChild(document.querySelector('.bnb-ballance-container'))
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
				ZOANMasterJS.balances.bnb = parseFloat(ZOANMasterJS.gameStats.balances.bnb.inETH).toFixed(3);
				
				/* figure out dollar balance */
				ZOANMasterJS.balances.usd_bnb =  ( parseFloat(ZOANMasterJS.balances.bnb , 8 ) * parseFloat(ZOANMasterJS.marketPrices.bnb , 8 ) ).toFixed(2);
				
				ZOANMasterJS.balances.zoon_bnb =  ( parseFloat(ZOANMasterJS.balances.usd_bnb , 8 ) / parseFloat(ZOANMasterJS.marketPrices.zoon , 8 ) ).toFixed(2);
				
				
						
				/* figure out zoon balance */
				ZOANMasterJS.balances.usd_zoon =  ( parseFloat(ZOANMasterJS.balances.zoon , 8 ) * parseFloat(ZOANMasterJS.marketPrices.zoon , 8 ) ).toFixed(2);
				ZOANMasterJS.balances.bnb_zoon =  ( parseFloat(ZOANMasterJS.balances.usd_zoon , 8 ) / parseFloat(ZOANMasterJS.marketPrices.bnb , 8 ) ).toFixed(2);
			
				
				/* set these prices into the header */
				document.querySelector('.zoon-balance-zoon').innerText =  ZOANMasterJS.balances.zoon + " ZOON  "
				document.querySelector('.zoon-balance-usd').innerText = " +$" + ZOANMasterJS.balances.usd_zoon + " "
				document.querySelector('.zoon-balance-bnb').innerText = " +" + ZOANMasterJS.balances.bnb_zoon + "BNB "
				document.querySelector('.bnb-balance-bnb').innerText =  ZOANMasterJS.balances.bnb + " BNB  "
				document.querySelector('.bnb-balance-usd').innerText = " +$" + ZOANMasterJS.balances.usd_bnb + " "
				document.querySelector('.bnb-balance-zoon').innerText = " +" + ZOANMasterJS.balances.zoon_bnb + " ZOON "
				
				/* calculate fee bnb cost in USD */
				var feesTodayUSD = ZOANMasterJS.gameStats.txFees.today * ZOANMasterJS.marketPrices.bnb;
				var feesWeekUSD = ZOANMasterJS.gameStats.txFees.thisWeek * ZOANMasterJS.marketPrices.bnb;
				var feesMonthUSD = ZOANMasterJS.gameStats.txFees.thisMonth * ZOANMasterJS.marketPrices.bnb;
				
				/* add day fees to UI */
				document.querySelector('.fee-bnb-today').innerText = parseFloat(ZOANMasterJS.gameStats.txFees.today).toFixed(3) + " BNB "
				document.querySelector('.fee-usd-today').innerText = " ($"+ parseFloat(feesTodayUSD).toFixed(3) + ") "
				
				/* add week fees to UI */
				document.querySelector('.fee-bnb-week').innerText =  parseFloat(ZOANMasterJS.gameStats.txFees.thisWeek).toFixed(3) + " BNB "
				document.querySelector('.fee-usd-week').innerText =  " ($"+ parseFloat(feesWeekUSD).toFixed(3) + ") "
				
				/* add month fees to UI */
				document.querySelector('.fee-bnb-month').innerText =  parseFloat(ZOANMasterJS.gameStats.txFees.thisMonth).toFixed(3) + " BNB "
				document.querySelector('.fee-usd-month').innerText =   " ($"+ parseFloat(feesMonthUSD).toFixed(3) + ") "
			
				/* Calculate Fight History Stats */
				ZOANMasterJS.loadFightHistoryStats(ZOANMasterJS.currentBattleScope)
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
		
		/* calculate profit */
		/* get market value of tokens */
		var marketTokens = ZOANMasterJS.marketPrices.zoon * ZOANMasterJS.gameStats.fights[period].tokenGains;
		document.querySelector('.stat-tokens').innerText = ZOANMasterJS.gameStats.fights[period].tokenGains.toFixed(2) + ' ($' + marketTokens.toFixed(2) +')';

		
		/* get market value of fees */
		var marketBNB = ZOANMasterJS.marketPrices.bnb * ZOANMasterJS.gameStats.fights[period].fees;
		document.querySelector('.stat-fees').innerText = ZOANMasterJS.gameStats.fights[period].fees.toFixed(3) + ' ($' + marketBNB.toFixed(2) +')';
		
		/* subtract the two for profit */
		var profit = marketTokens - marketBNB;
		
		if (profit < 0 ) {
			document.querySelector('.stat-profit').style.color = "tomato"; 
			document.querySelector('.stat-profit').innerText = '-$' + profit.toFixed(2).replace('-','');
		} else {
			document.querySelector('.stat-profit').style.color = "lightgreen";
			document.querySelector('.stat-profit').innerText = '$' + profit.toFixed(2);
		}
		
		/* get win percentage */
		if (!ZOANMasterJS.gameStats.fights[period].totalFights) {
			document.querySelector('.stat-win-percentage').innerText = "0%"; 
		} else {
			var winPercentage =  ( ZOANMasterJS.gameStats.fights[period].wins / ZOANMasterJS.gameStats.fights[period].totalFights ) * 100;
			document.querySelector('.stat-win-percentage').innerText = winPercentage.toFixed(0) + "%";
		}
		
		/* get average EXP */
		if (!ZOANMasterJS.gameStats.fights[period].expGains) {
			document.querySelector('.stat-average-zoon-battle').innerText = "0"; 
			document.querySelector('.stat-average-zoon-win').innerText = "0"; 
		} else {
			/* per battle */
			var averageExpGains =  ( ZOANMasterJS.gameStats.fights[period].expGains / ZOANMasterJS.gameStats.fights[period].totalFights )
			document.querySelector('.stat-average-exp-battle').innerText = averageExpGains.toFixed(2) + ' EXP';
			
			/* per win */
			var averageExpGains =  ( ZOANMasterJS.gameStats.fights[period].expGains / ZOANMasterJS.gameStats.fights[period].wins )
			document.querySelector('.stat-average-exp-win').innerText = averageExpGains.toFixed(2) + ' EXP';
		}
		
		/* get average ZOON */
		if (!ZOANMasterJS.gameStats.fights[period].tokenGains) {
			document.querySelector('.stat-average-zoon-battle').innerText = "0"; 
			document.querySelector('.stat-average-zoon-win').innerText = "0"; 
		} else {
			/* per battle */
			var averageTokenGains =  ( ZOANMasterJS.gameStats.fights[period].tokenGains / ZOANMasterJS.gameStats.fights[period].totalFights )
			var marketAverageTokenGains = ZOANMasterJS.marketPrices.zoon * averageTokenGains;
			document.querySelector('.stat-average-zoon-battle').innerText = averageTokenGains.toFixed(2) + ' ($'+marketAverageTokenGains.toFixed(2)+')';
			
			/* per win */
			var averageTokenGains =  ( ZOANMasterJS.gameStats.fights[period].tokenGains / ZOANMasterJS.gameStats.fights[period].wins )
			var marketAverageTokenGains = ZOANMasterJS.marketPrices.zoon * averageTokenGains;
			document.querySelector('.stat-average-zoon-win').innerText = averageTokenGains.toFixed(2) + ' ($'+marketAverageTokenGains.toFixed(2)+')';
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
			var averageFees =  ( ZOANMasterJS.gameStats.fights[period].fees / ZOANMasterJS.gameStats.fights[period].wins )
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