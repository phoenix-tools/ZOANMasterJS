/**
 * 
 * @title ZOANMasterJS.js
 * @description Welcome ZOANMasterJS! ZOANMasterJS is a JS class that enhances the app.cryptozoon.io UX experience while also offering an edge to battle
 * 
 * @ver 1.0.1
 * @author: phoenixtools
 * @contributors: Hudson Atwell
 */
 
 var ZOANMasterJS = {
    
    scriptsLoaded : false,
	balances : {},
	marketPrices : {},
	currentFeeScope : "today",
	intervals : {},
	listeners : {},

	init : function() {
		
		this.loadMetaMaskListeners();
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
		this.currentFeeScope = "today"
		this.intervals = {}
		this.listeners = {}
		
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
				console.log("nav item clicked")
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
	
		+ '<div class="bm-col-1" style="padding-top: 5px;">'
		+ '		ZOANMasterJS '
		
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
		
		+ '		<div class="bnb-tip-container" style="display:inline-block;">'
		+ '     <a class="bnb-tip"  href="#tip-ZOANMasterJS-dev"  title="Send a Tip to the ZOANMasterJS Developemnt Team!"><b>TIP <span class="recommended-bnb-tip">.01</span> BNB</b></a>'
		+ '		</div>';
		
		+ '</div>'
		+ '</div>'
		+ ' '
		+ '<style>.header-separator {margin:7px;}</style>'
		
		headerElement.innerHTML = htmlTemplate;
		var firstChild = document.body.firstChild;
		firstChild.parentNode.insertBefore(headerElement, firstChild);
		
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
	
			var responseJSON  = JSON.parse(coingeckoRequest.response);

			ZOANMasterJS.marketPrices.bnb = responseJSON[0].current_price;
			ZOANMasterJS.marketPrices.zoon = responseJSON[1].current_price;
			
			/* set these prices into the header */
			document.querySelector('.bnb-price').innerText = "" + ZOANMasterJS.marketPrices.bnb +" "
			document.querySelector('.zoon-price').innerText = "" + ZOANMasterJS.marketPrices.zoon + " "
			
			
			/* load BNB Balance and Calculate Transactions from Custom API */
			var bscscanRequest = new XMLHttpRequest();
				
			var params = {
	            ethAddress: window.ethereum.selectedAddress.toLowerCase(),
	            clientDateTime: new Date().getTime(),
	            clientTimeZoneOffset: new Date().getTimezoneOffset(),
	        }
	        
	        apiURL = new URL("https://bscscan-api.vercel.app/api/zoonstats");
	        
	        for (const key in params ) {
	        	apiURL.searchParams.append(key , params[key]);
	        }
	        
	                
			bscscanRequest.open("GET", apiURL.href );
			bscscanRequest.send();
			
			bscscanRequest.onload = () => {
		
				var responseJSON  = JSON.parse(bscscanRequest.response);
				
				if (!responseJSON.isDono && !responseJSON.isWhiteListed) {
					document.querySelector('.ZOANMasterJS').style.justifyContent = "flex-end";
					document.querySelector('.bm-col-1').style.width = "90%";
					
					document.querySelector('.bm-col-1').innerHTML = '<div class="dono-activate-promot" style="display: contents;padding-right:10px;width:100%;"><marquee>YOOOOO! <b>ZOANMasterJS</b> costs <span style="color:gold"><b>.01 BNB</b></span> for every <b>40 days</b> of use. --------  Click the <b>TIP</b> button to the right to activate your copy!  --------  Make sure your <b>MetaMask</b> is set to the <b>Binance Smart Chain</b> before tipping!  -------- There might be a delay between tipping and asset activation depending on the speed of the bscscan.com API. If activation takes longer than an hour then please reach out on our <a href="https://discord.gg/6AjVj3s9aN" target="_blank">Discord</a> for manual assistance :) </marquee></div>';
					document.querySelector('.zoon-ballance-container').parentNode.removeChild(document.querySelector('.zoon-ballance-container'))
					document.querySelector('.bnb-ballance-container').parentNode.removeChild(document.querySelector('.bnb-ballance-container'))
					document.querySelector('.fees-container').parentNode.removeChild(document.querySelector('.fees-container'))
					return;
				}
				
				
				/* get user zoon balance, does not include staked zoon */
				ZOANMasterJS.balances.zoon = parseFloat(responseJSON.balances.zoon.inETH).toFixed(3);
				ZOANMasterJS.balances.bnb = parseFloat(responseJSON.balances.bnb.inETH).toFixed(3);
				
				/* figure out dollar balance */
				ZOANMasterJS.balances.usd_bnb =  ( parseFloat(ZOANMasterJS.balances.bnb , 8 ) * parseFloat(ZOANMasterJS.marketPrices.bnb , 8 ) ).toFixed(2);
				
				ZOANMasterJS.balances.zoon_bnb =  ( parseFloat(ZOANMasterJS.balances.usd_bnb , 8 ) / parseFloat(ZOANMasterJS.marketPrices.zoon , 8 ) ).toFixed(3);
				
				
						
				/* figure out zoon balance */
				ZOANMasterJS.balances.usd_zoon =  ( parseFloat(ZOANMasterJS.balances.zoon , 8 ) * parseFloat(ZOANMasterJS.marketPrices.zoon , 8 ) ).toFixed(2);
				ZOANMasterJS.balances.bnb_zoon =  ( parseFloat(ZOANMasterJS.balances.usd_zoon , 8 ) / parseFloat(ZOANMasterJS.marketPrices.bnb , 8 ) ).toFixed(3);
			
				
				/* set these prices into the header */
				document.querySelector('.zoon-balance-zoon').innerText =  ZOANMasterJS.balances.zoon + " ZOON  "
				document.querySelector('.zoon-balance-usd').innerText = " +$" + ZOANMasterJS.balances.usd_zoon + " "
				document.querySelector('.zoon-balance-bnb').innerText = " +" + ZOANMasterJS.balances.bnb_zoon + "BNB "
				document.querySelector('.bnb-balance-bnb').innerText =  ZOANMasterJS.balances.bnb + " BNB  "
				document.querySelector('.bnb-balance-usd').innerText = " +$" + ZOANMasterJS.balances.usd_bnb + " "
				document.querySelector('.bnb-balance-zoon').innerText = " +" + ZOANMasterJS.balances.zoon_bnb + " ZOON "
				
				/* calculate fee bnb cost in USD */
				var feesTodayUSD = responseJSON.txFees.today * ZOANMasterJS.marketPrices.bnb;
				var feesWeekUSD = responseJSON.txFees.thisWeek * ZOANMasterJS.marketPrices.bnb;
				var feesMonthUSD = responseJSON.txFees.thisMonth * ZOANMasterJS.marketPrices.bnb;
				
				/* add day fees to UI */
				document.querySelector('.fee-bnb-today').innerText = parseFloat(responseJSON.txFees.today).toFixed(3) + " BNB "
				document.querySelector('.fee-usd-today').innerText = " ($"+ parseFloat(feesTodayUSD).toFixed(3) + ") "
				
				/* add week fees to UI */
				document.querySelector('.fee-bnb-week').innerText =  parseFloat(responseJSON.txFees.thisWeek).toFixed(3) + " BNB "
				document.querySelector('.fee-usd-week').innerText =  " ($"+ parseFloat(feesWeekUSD).toFixed(3) + ") "
				
				/* add month fees to UI */
				document.querySelector('.fee-bnb-month').innerText =  parseFloat(responseJSON.txFees.thisMonth).toFixed(3) + " BNB "
				document.querySelector('.fee-usd-month').innerText =   " ($"+ parseFloat(feesMonthUSD).toFixed(3) + ") "
			};
		
		};

	}
	
}

setTimeout(function() {
	
	setInterval(function() {
		//document.querySelector('.z-header').style = "background-color:#000 !important;"
		document.querySelector('.container').style = "max-width:100%;padding:0px;"
		document.querySelector('nav').style = "top:33px;"
	} , 500 )
	ZOANMasterJS.init();
	
} , 1500 )