(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{22:function(e,t,a){e.exports=a(31)},27:function(e,t,a){},28:function(e,t,a){e.exports=a.p+"static/media/logo.5d5d9eef.svg"},30:function(e,t,a){},31:function(e,t,a){"use strict";a.r(t);var n=a(0),s=a.n(n),r=a(16),c=a.n(r),i=(a(27),a(28),a(9)),o=a(1),l=a(5),d=a(3),u=a(2),f=a(4),h=a(8),m=a(17),p=a(21),v=a(7),y=function(e){function t(){var e,a;Object(o.a)(this,t);for(var n=arguments.length,s=new Array(n),r=0;r<n;r++)s[r]=arguments[r];return(a=Object(d.a)(this,(e=Object(u.a)(t)).call.apply(e,[this].concat(s)))).refThreatSize=function(e){e&&a.props.getThreatWidth({width:e.getBoundingClientRect().width,height:e.getBoundingClientRect().height})},a.refNumberWdithSize=function(e){e&&a.props.getNumberWidth(e.getBoundingClientRect().width)},a}return Object(f.a)(t,e),Object(l.a)(t,[{key:"render",value:function(){var e=this;return s.a.createElement("div",{className:"hadesContainer",ref:this.refThreatSize},s.a.createElement("div",{className:"dice-container"},s.a.createElement("div",{className:"dice-face"},this.props.dice1),s.a.createElement("div",{className:"dice-face"},this.props.dice2)),s.a.createElement("div",{className:"hadesCounterContainer"},s.a.createElement(v.a.div,{className:"hadesCounter",style:this.props.hadesCounter}),s.a.createElement("ul",{className:"numbers"},[0,1,2,3,4,5,6,7,8,9].map(function(t){return s.a.createElement("li",{ref:e.refNumberWdithSize},t)}))),s.a.createElement(v.a.img,{className:"hades",draggable:"false",src:"/shuffler/hades.jpg",style:this.props.hades}))}}]),t}(s.a.Component),g=a(18),b=a.n(g),C=a(6),O=a.n(C),x=a(11),j=a.n(x),T=a(13),E=a.n(T),k=a(19),H=a.n(k),S=a(20),N=a.n(S),w=0,F=function(e,t,a,n,s,r,c,i){return function(o){var l={},d=Math.floor(11*Math.random())-5,u=t[o],f="/shuffler/"+u.name+".png";return l=s&&o===r?{y:u.shuffling?125:c*w+i,scale:u.shuffling?1:1.1,zIndex:"1",shadow:15,immediate:function(e){return"y"===e||"zIndex"===e}}:{y:u.shuffling?125:n?e.indexOf(o)*w:0,scale:1,zIndex:"0",shadow:1,immediate:!1,src:e.indexOf(o)>=a||u.shuffling?"/shuffler/blank.png":f},Object(m.a)({},{opacity:1,z:u.shuffling?d:0},l)}},I=function(e){return function(t){return{opacity:e[t].used?0:1,y:e[t].used?100:0,name:e[t].name}}},A=function(e){var t=e.tiles,a=e.favorTiles,r=e.ordering,c=e.lastPlayerIndex,i=Object(n.useState)(0),o=Object(h.a)(i,2),l=o[0],d=o[1],u=Object(n.useState)(0),f=Object(h.a)(u,2),m=f[0],g=f[1],C=Object(n.useState)(!1),x=Object(h.a)(C,2),T=x[0],k=x[1],S=Object(n.useState)(0),A=Object(h.a)(S,2),M=A[0],z=A[1],P=Object(n.useState)(!1),W=Object(h.a)(P,2),B=W[0],R=W[1],J=Object(v.c)(function(){return{transform:"translate3d(0px, -".concat(w,"px, 0)")}}),G=Object(h.a)(J,2),Z=G[0],$=G[1],q=Object(v.c)(function(){return{transform:"translate3d(0px,0px,0)"}}),D=Object(h.a)(q,2),K=D[0],L=D[1],Q=Object(v.d)(t.length,F(r,t,c,B)),U=Object(h.a)(Q,2),V=U[0],X=U[1],Y=Object(v.d)(a.length,I(a)),_=Object(h.a)(Y,2),ee=_[0],te=_[1],ae=function(e){if(e){var t=e.getBoundingClientRect().width/3.8744588744588744;w=w>0?Math.min(t,w):t,B||R(!0)}},ne=Object(p.a)(function(a){var n=Object(h.a)(a.args,1)[0],s=a.down,i=Object(h.a)(a.delta,2)[1],o=r.indexOf(n),l=b()(Math.round((o*w+i)/w),0,t.length-1),d=H()(r,o,l);X(F(d,t,c,B,s,n,o,i,e.playerCount)),s||(e.setOrdering(d),e.addToHistory({cycle:e.cycleCount,order:d,wasShuffled:!0}))}),se=function(){var t=N()(a,function(e){return!1===e.used}),n=a.map(function(e,a){return a===t?Object.assign({},e,{used:!0}):e});e.setFavorTiles(n),te(I(n)),(0===t||e.hadesActive)&&function(){var t=O()(e.defaultFavorTiles);e.setFavorTiles(t),te(I(t))}()},re=function(e){return O()(e)},ce=function(t,a){var n=E()(a),s=O()(j()(t,0,e.tiles.length-1));return s.unshift(n),s},ie=Object(n.useCallback)(function(a){t.forEach(function(e){e.shuffling=!0}),X(F(a,t,c,B)),e.isHades&&function(){var t=e.rollForHades();L({transform:"translate3d(".concat(0===t?t:t*l.width/9-m,"px,0px,0px)")}),t>9?(setTimeout(function(){$({opacity:1,transform:"translate3d(0px, ".concat(w*(e.playerCount-2)+l.height+10,"px,0px)")})},400),L({transform:"translate3d(0px,0px,0px)"}),e.resetHades(),e.setHadesActive()):$({opacity:0,transform:"translate3d(0px,-".concat(w,"px,0px)"),zIndex:"999"})}(),setTimeout(function(){t.forEach(function(e){e.shuffling=!1}),X(F(a,t,c,B))},500)});return Object(n.useEffect)(function(){0===M&&B&&X(F(e.ordering,t,c,B))},[B,c,e.ordering,M,X,t]),s.a.createElement("div",{className:"cardlist-container ".concat(0==e.isHades?"add-margin":"")},s.a.createElement("div",{className:"top-container"},s.a.createElement("div",{className:"active-text",onClick:e.back},"Back"),s.a.createElement("div",{className:"active-text ".concat(T?"disabled":""),onClick:function(){var t,a;z(M+1),k(!0),setTimeout(function(){k(!1)},500),e.incrementCycle(),e.isFavors&&se();var n=E()(e.shuffleHistory),s=n.order;if(!e.isTitans&&(5===e.playerCount&&(t=re(r)),4!==e.playerCount&&2!==e.playerCount||(t=ce(r,s)),3===e.playerCount))if(n.wasShuffled){var c=j()(s,2,4),i=j()(s,0,2);t=c.concat(i),a=!1}else t=O()(r),a=!0;if(e.isTitans){if(6===e.playerCount&&(t=re(r)),5===e.playerCount&&(t=ce(r,s)),4===e.playerCount)if(n.wasShuffled){var o=j()(s,3,5),l=O()(j()(s,0,3));t=o.concat(l),a=!1}else t=O()(r),a=!0;if(3===e.playerCount){var d=O()(j()(s,2,5)),u=j()(d,0,2),f=j()(s,0,2),h=E()(d);t=u.concat(f).concat(h)}}e.addToHistory({cycle:e.cycleCount,order:t,wasShuffled:a}),e.setOrdering(t),ie(t,e.playerCount)}},"Go")),e.isHades&&s.a.createElement(y,{dice1:e.dice1,dice2:e.dice2,getThreatWidth:function(e){return d(e)},getNumberWidth:function(e){return g(e)},hades:Z,hadesCounter:K}),s.a.createElement("div",{className:"card-list",style:{height:t.length*w}},V.map(function(e,t){var a=e.zIndex,n=e.shadow,r=e.y,c=e.z,i=e.scale,o=e.opacity,l=e.backgroundColor,d=e.src;return s.a.createElement(v.a.img,Object.assign({},ne(t),{ref:ae,draggable:"false",key:t,src:d,style:{backgroundColor:l,zIndex:a,opacity:o,boxShadow:n.interpolate(function(e){return"rgba(0, 0, 0, 0.15) 0px ".concat(e,"px ").concat(2*e,"px 0px")}),transform:Object(v.b)([r,i,c],function(e,t,a){return"rotateZ(".concat(a,"deg) translate3d(0px,").concat(e,"px,0) scale(").concat(t,")")})}}))})),s.a.createElement("div",{className:"favor-container"},e.isFavors&&!e.hadesActive&&ee.map(function(e){return s.a.createElement(v.a.img,{className:"favors",draggable:"false",src:"".concat("/shuffler","/").concat(e.name.value,".jpg"),style:{opacity:e.opacity,transform:Object(v.b)([e.y],function(e){return"translate3d(0,".concat(e,"px,0)")})}})})))},M=function(e){function t(){return Object(o.a)(this,t),Object(d.a)(this,Object(u.a)(t).apply(this,arguments))}return Object(f.a)(t,e),Object(l.a)(t,[{key:"render",value:function(){return s.a.createElement("label",{className:"checkbox-item"},this.props.label,s.a.createElement("input",{name:this.props.label,type:"checkbox",checked:this.props.checked,onChange:this.props.onChange}))}}]),t}(s.a.Component),z=function(e){return s.a.createElement("div",{className:"player-selector"},s.a.createElement("div",{className:"player-text"},"Players:"),e.players.map(function(t){return s.a.createElement("div",{key:t,className:"player-item ".concat(e.playerCount===t?"selected":""," ").concat(e.isTitans||6!==t?"":"disabled"),onClick:function(){return e.setPlayerCount(t)}},t)}))},P=[0,1,2,3],W=[3,4,5,6],B=[0,1,2,3,4],R=[0,1,1,2,2,3],J=[{name:"aphrodite",used:!1},{name:"artemis",used:!1},{name:"demeter",used:!1},{name:"dionysos",used:!1},{name:"hephaistos",used:!1},{name:"hermes",used:!1},{name:"hera",used:!1},{name:"hestia",used:!1}],G=[{name:"ares"},{name:"athena"},{name:"zeus"},{name:"poseidon"}],Z=[{name:"ares"},{name:"athena"},{name:"zeus"},{name:"poseidon"},{name:"kronos"}],$=function(e){function t(e){var a;return Object(o.a)(this,t),(a=Object(d.a)(this,Object(u.a)(t).call(this,e))).incrementCycleCount=function(){a.setState({cycleCount:a.state.cycleCount+1})},a.setPlayerCount=function(e){var t=e-1,n=a.state.isTitans?Z:G;a.setState({playerCount:e,lastPlayerIndex:t,tiles:[]}),setTimeout(function(){a.setState({tiles:n})})},a.addToShuffleHistory=function(e){var t=[].concat(Object(i.a)(a.state.shuffleHistory),[e]);a.setState({shuffleHistory:t})},a.setOrdering=function(e){a.setState({ordering:e})},a.setHadesActive=function(){a.setState({hadesActive:!0})},a.resetHades=function(){a.setState({hadesTotal:0})},a.rollForHades=function(){var e=R.length,t=O()(R)[Math.floor(Math.random()*e)],n=O()(R)[Math.floor(Math.random()*e)],s=a.state.hadesTotal+t+n;return a.setState({dice1:t,dice2:n,hadesTotal:s,hadesActive:!1}),s},a.setIsFavors=function(e){a.setState({isFavors:e})},a.setIsHades=function(e){a.setState({isHades:e})},a.setIsTitans=function(e){var t=e?B:P,n=[{cycle:0,order:t,wasShuffled:!0}];a.setState({isTitans:e,tiles:e?Z:G,ordering:t,players:W,shuffleHistory:n})},a.start=function(){a.setState({screenMode:2,hadesTotal:0,hadesActive:!1})},a.back=function(){a.setState({screenMode:1})},a.options=function(){a.setState({screenMode:3})},a.onChangeHades=function(e){a.setIsHades("checkbox"===e.target.type?e.target.checked:e.target.value)},a.onChangeFavors=function(e){a.setIsFavors("checkbox"===e.target.type?e.target.checked:e.target.value)},a.onChangeTitans=function(e){a.setIsTitans("checkbox"===e.target.type?e.target.checked:e.target.value)},a.setFavorTiles=function(e){a.setState({favorTiles:e})},a.renderApp=function(){return 1===a.state.screenMode?s.a.createElement("ul",{className:"start"},s.a.createElement("li",{onClick:a.start},"Start"),s.a.createElement("li",{onClick:a.options,className:"btnOpt"},"Options")):2===a.state.screenMode?s.a.createElement(A,{ordering:a.state.ordering,setOrdering:a.setOrdering,addToHistory:a.addToShuffleHistory,incrementCycle:a.incrementCycleCount,rollForHades:a.rollForHades,setHadesActive:a.setHadesActive,resetHades:a.resetHades,back:a.back,lastPlayerIndex:a.state.lastPlayerIndex,cycleCount:a.state.cycleCount,tiles:a.state.tiles,isTitans:a.state.isTitans,isHades:a.state.isHades,isFavors:a.state.isFavors,shuffleHistory:a.state.shuffleHistory,playerCount:a.state.playerCount,hadesActive:a.state.hadesActive,setFavorTiles:a.setFavorTiles,favorTiles:a.state.favorTiles,defaultFavorTiles:J,dice1:a.state.dice1,dice2:a.state.dice2}):3===a.state.screenMode?s.a.createElement("div",{className:"options"},s.a.createElement("div",{className:"active-text",onClick:a.back},"back"),s.a.createElement(z,{isTitans:a.state.isTitans,players:a.state.players,playerCount:a.state.playerCount,setPlayerCount:a.setPlayerCount}),s.a.createElement("div",{className:"checkbox-container"},s.a.createElement(M,{label:"Titans",checked:a.state.isTitans,onChange:a.onChangeTitans}),s.a.createElement(M,{label:"Hades",checked:a.state.isHades,onChange:a.onChangeHades}),s.a.createElement(M,{label:"Favors",checked:a.state.isFavors,onChange:a.onChangeFavors}))):void 0},a.state={screenMode:1,isOptions:!1,playerCount:5,players:W,cycleCount:0,isTitans:!1,isHades:!1,isFavors:!1,hadesActive:!1,hadesTotal:0,lastPlayerIndex:4,favorTiles:O()(J),tiles:G,ordering:P,dice1:1,dice2:1,shuffleHistory:[{cycle:0,order:P,wasShuffled:!0}]},a}return Object(f.a)(t,e),Object(l.a)(t,[{key:"render",value:function(){return s.a.createElement("div",{className:"app-container"},this.renderApp())}}]),t}(s.a.Component);a(30);var q=function(){return s.a.createElement("div",{className:"App"},s.a.createElement("header",{className:"App-header"},s.a.createElement($,null)))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));c.a.render(s.a.createElement(q,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then(function(e){e.unregister()})}},[[22,1,2]]]);
//# sourceMappingURL=main.81e4fe5f.chunk.js.map