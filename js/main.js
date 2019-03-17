/* 
 * Desenvolver: Hedrei Andrade
 * hedreiandrade@gmail.com
*/

// Entrada dos DDDs
// Caso todos os dados estejam preenchidos chama cálculo
function ddds() {
	var valueOrigin = document.getElementById('orig').value;
  	var valueDestination = document.getElementById('dest').value;
  	var valueTime = document.getElementById('valueTime').value;
	if( checkInputs(valueOrigin, valueDestination, valueTime) ){
		prepareCalculation();
	}
}

// Entrada dos Minutos
// Caso todos os dados estejam preenchidos chama cálculo
function time() {
	var valueOrigin = document.getElementById('orig').value;
  	var valueDestination = document.getElementById('dest').value;
  	var valueTime = document.getElementById('valueTime').value;
	if( checkInputs(valueOrigin, valueDestination, valueTime) ){
		prepareCalculation();
	}
}

// Verifica combinações existentes
function checkCombination(valueOrigin = 0, valueDestination = 0) {
	var result = false;
	
  	if( parseInt(valueOrigin) == 16 && parseInt(valueDestination) == 11){
  		result = true;
  	}
   	if( parseInt(valueOrigin) == 11 && parseInt(valueDestination) == 16){
  		result = true;
  	}
  	if( parseInt(valueOrigin) == 11 && parseInt(valueDestination) == 17){
  		result = true;
  	}
   	if( parseInt(valueOrigin) == 17 && parseInt(valueDestination) == 11){
  		result = true;
  	}
  	if( parseInt(valueOrigin) == 11 && parseInt(valueDestination) == 18){
  		result = true;
  	}
   	if( parseInt(valueOrigin) == 18 && parseInt(valueDestination) == 11){
  		result = true;
  	}

  	return result;
}

// Limpa valores
function resetInputs() {
	document.getElementById('plan0').value = '';
	document.getElementById('plan30').value = '';
	document.getElementById('plan60').value = '';
	document.getElementById('plan120').value = '';
}

// Validações para os inputs fornecidos
function checkInputs(valueOrigin = 0, valueDestination = 0, valueTime = 0) {
	if(parseInt(valueOrigin) <= 0 || parseInt(valueDestination) <= 0 || isNaN( parseInt( document.getElementById('valueTime').value)) ){
		return false;
	}

  	if( valueTime <= 0 ){
  		document.getElementById('errorMsg').innerHTML = 'Tempo deve ser maior que zero.';
		document.getElementById("errorMsg").style.display = 'block';
		resetInputs();
		return false;
  	}else{
  		document.getElementById("errorMsg").style.display = 'none';
  	}

  	if( checkCombination(valueOrigin, valueDestination) ){
  		document.getElementById('errorMsg').style.display = 'none';
  		return true;
  	}else{
		document.getElementById('errorMsg').innerHTML = 'Combinação inexistente.';
		document.getElementById('errorMsg').style.display = 'block';
		resetInputs();
  	}
  	
  	return false;
}

// Essa função só é chamada após todos os dados serem fornecidos
// Vamos preparar os dados para cálcular os valores seguindo os dados, 
// fornecidos via json pelas API e pelo tempo informado pelo cliente.
function prepareCalculation() {
	var valueOrigin = parseInt(document.getElementById('orig').value);
	var valueDestination = parseInt(document.getElementById('dest').value);
	var valueTime = parseInt(document.getElementById('valueTime').value);
	// Verificado preco para esse tipo de ligação
	$.getJSON( 'http://private-fe2a-scuptel.apiary-mock.com/ddd/pricing', function(dataPrices) {
		for (var key in dataPrices.data) {
			if( valueOrigin == 11 && valueDestination == 16){ // 11 para 16
				if( dataPrices.data[key].origin == 11 && dataPrices.data[key].destiny == 16 ){
					showCalculation( parseFloat(dataPrices.data[key].price), valueTime ); break;
				}
			}
			if( valueOrigin == 16 && valueDestination == 11){ // 16 para 11
				if( dataPrices.data[key].origin == 16 && dataPrices.data[key].destiny == 11 ){
					showCalculation( parseFloat(dataPrices.data[key].price), valueTime ); break;
				}
			}
			if( valueOrigin == 11 && valueDestination == 17){ // 11 para 17
				if( dataPrices.data[key].origin == 11 && dataPrices.data[key].destiny == 17 ){
					showCalculation( parseFloat(dataPrices.data[key].price), valueTime ); break;
				}
			}
			if( valueOrigin == 17 && valueDestination == 11){ // 17 para 11
				if( dataPrices.data[key].origin == 17 && dataPrices.data[key].destiny == 11 ){
					showCalculation( parseFloat(dataPrices.data[key].price), valueTime ); break;
				}
			}
			if( valueOrigin == 11 && valueDestination == 18){ // 11 para 18
				if( dataPrices.data[key].origin == 11 && dataPrices.data[key].destiny == 18 ){
					showCalculation( parseFloat(dataPrices.data[key].price), valueTime ); break;
				}
			}
			if( valueOrigin == 18 && valueDestination == 11){ // 18 para 11
				if( dataPrices.data[key].origin == 18 && dataPrices.data[key].destiny == 11 ){
					showCalculation( parseFloat(dataPrices.data[key].price), valueTime ); break;
				}
			}
		}
	}).fail(function() {
		alert('Temos um problema interno. Por favor tente realizar a simulação novamente mais tarde. Desculpe o transtorno.');
	});
}

// Calcula e alimenta o Front, 
// informado o cliente os valores de cada plano
function showCalculation(price = 0, valueTime = 0) {
	if( valueTime > 30 && valueTime <= 60 ){
		document.getElementById('plan30').value = calculation(valueTime, price, 30);
	}
	if(valueTime > 60 && valueTime <= 120 ){
		document.getElementById('plan30').value = calculation(valueTime, price, 30);
		document.getElementById('plan60').value = calculation(valueTime, price, 60);
	}
	if(valueTime > 120){
		document.getElementById('plan30').value = calculation(valueTime, price, 30);
		document.getElementById('plan60').value = calculation(valueTime, price, 60);
		document.getElementById('plan120').value = calculation(valueTime, price, 120);
	}
	document.getElementById('plan0').value = calculation(valueTime, price, 0);
}

// Cálculo para excedentes de minutos e valores normais, 
// respeitando o tipo do plano(typePlan)
function calculation(valueTime = 0, price = 0, typePlan) {
	var result = 0;
	var priceExcess = 0;
	priceExcess =  (price * 10) / 100; // + 10% de acrescimo
	priceExcess = parseFloat(price + priceExcess);

	if(typePlan > 0){ // Excedentes
		result = maskValue( parseFloat( ( valueTime - typePlan ) * priceExcess).toFixed(2) );
	}else{ // Normal
		result = maskValue( parseFloat(valueTime * price).toFixed(2) );
	}

	return result;
}

// Formata para moeda
function maskValue(valor) {
    valor = valor.toString().replace(/\D/g,"");
    valor = valor.toString().replace(/(\d)(\d{8})$/,"$1.$2");
    valor = valor.toString().replace(/(\d)(\d{5})$/,"$1.$2");
    valor = valor.toString().replace(/(\d)(\d{2})$/,"$1,$2");

    return valor                    
}