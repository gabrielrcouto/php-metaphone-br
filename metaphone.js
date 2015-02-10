/***************************** COPYRIGHT NOTICES ***********************
Some of this code is based on metaphone.c file, which can be found here:
http://www2.varzeapaulista.sp.gov.br/metaphone/

The metaphone port is authored by Carlos Costa Jordao <carlosjordao@gmail.com>
and is covered under this copyright:

  Copyright 2014, Carlos Costa Jordao <carlosjordao@gmail.com>.
  All rights reserved.

  Redistribution and use in source and binary forms, with or without modification,
  are permitted provided that the following conditions are met:
  
  1. Redistributions of source code must retain the above copyright notice, this 
     list of conditions and the following disclaimer.
  2. Redistributions in binary form must reproduce the above copyright notice, this
     list of conditions and the following disclaimer in the documentation and/or
     other materials provided with the distribution.
  
  
  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
  ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED 
  WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
  DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR 
  ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES 
  (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; 
  LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON 
  ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT 
  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS 
  SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
***********************************************************************/

// Criando o Módulo Metaphone
YUI.add('metaphone', function(Y) {
	Y.Metaphone = {};
	
	Y.Metaphone.getMeta = function() {
		// Implementação emcapsulada numa Função Anonima
		function isVowel(paramChar) {
			switch (paramChar) {
			case 'A':
			case 'E':
			case 'I':
			case 'O':
			case 'U':
				return true;
			}
			return false;
		}

		function toUpper(paramChar) {
			var i = paramChar.toUpperCase();

			switch (i) {
			// case 'ç': return 'Ç';
			case 'Á':
			case 'À':
			case 'Ã':
			case 'Â':
			case 'Ä':
				return 'A';
			case 'É':
			case 'È':
			case 'Ẽ':
			case 'Ê':
			case 'Ë':
				return 'E';
			case 'Y':
			case 'Í':
			case 'Ì':
			case 'Ĩ':
			case 'Î':
			case 'Ï':
				return 'I';
			case 'Ó':
			case 'Ò':
			case 'Õ':
			case 'Ô':
			case 'Ö':
				return 'O';
			case 'Ú':
			case 'Ù':
			case 'Ũ':
			case 'Û':
			case 'Ü':
				return 'U';
			}

			return i;
		}

		function isWordEdge(char1) {
			if (char1 == '' || char1 == '\0' || char1 == '\n' || char1 == ' '
					|| char1 == '\t') {
				return true;
			}
			return false;
		}

		function metaphoneptbr(paramStr) {
			var strAnalise = '';

			// preparação - caixa alta e limpar letras duplicadas (comuns com nomes)
			for (var i = 0; i < paramStr.length; i++) {
				strAnalise += toUpper(paramStr.charAt(i));
			}

			var arrDuplos = strAnalise
					.match(/B{2,}|C{2,}|D{2,}|F{2,}|G{2,}|H{2,}|J{2,}|K{2,}|L{2,}|M{2,}|N{2,}|P{2,}|T{2,}|V{2,}|W{2,}|X{2,}|Z{2,}/g);
			for (i = 0; arrDuplos && i < arrDuplos.length; i++) {
				strAnalise = strAnalise.replace(arrDuplos[i], arrDuplos[i]
						.charAt(0));
			}

			// variaveis para o algoritmo
			var metaString = '';
			var tamanho = strAnalise.length;
			var charAhead1, charAhead2, charLast1, charLast2, charCurrent;
			charAhead1 = charAhead2 = charLast1 = charLast2 = charCurrent = '';

			i = 0;
			while (i < tamanho && metaString.length < 4) {
				charCurrent = strAnalise.charAt(i);
				switch (charCurrent) {
				case 'A':
				case 'E':
				case 'I':
				case 'O':
				case 'U':
					/*
					 * vogais iniciando a palavra ficam. herança do metaphone
					 * original, mas pode-se discutir removê-las no futuro
					 */
					if (isWordEdge(charLast1)) {
						metaString += charCurrent;
					}
					break;

				case 'L':
					charAhead1 = strAnalise.charAt(i + 1);
					/* lha, lho. */
					if (charAhead1 == 'H') {
						metaString += '1';
					} else {
						/* como em Louco, aloprado, alado, lampada, etc */
						if (isVowel(charAhead1) || isWordEdge(charLast1)) {
							metaString += 'L';
						}
						/* atualmente ignora L antes de consoantes */
					}
					break;

				case 'T':
				case 'P':
					/*
					 * Casos especiais de nomes estrangeiros ou sintaxe antiga do
					 * português.
					 */
					charAhead1 = strAnalise.charAt(i + 1);
					if (charAhead1 == 'H') {
						/* phone, pharmacia, teophilo */
						if (charCurrent == 'P')
							metaString += 'F';
						else
							metaString += 'T';
						i++;
						break;
					}

				case 'B':
				case 'D':
				case 'F':
				case 'J':
				case 'K':
				case 'M':
				case 'V':
					metaString += charCurrent;
					break;

				/* checar consoantes com som confuso e similares */
				case 'G':
					charAhead1 = strAnalise.charAt(i + 1);
					switch (charAhead1) {
					case 'H':
						/*
						 * H sempre complica a vida. Se não for vogal, tratar como
						 * 'G', caso contrário segue o fluxo abaixo.
						 */
						if (!isVowel(strAnalise.charAt(i + 2))) {
							metaString += 'G';
							break;
						}
					case 'E':
					case 'I':
						metaString += 'J';
						break;

					default:
						metaString += 'G';
						break;
					}
					break;

				case 'R':
					charAhead1 = strAnalise.charAt(i + 1);

					/* como em andar, carro, rato */
					if (isWordEdge(charLast1) || isWordEdge(charAhead1)) {
						metaString += '2';
					} else if (charAhead1 == 'R') {
						metaString += '2';
						i++;
					}
					/* como em arara */
					else if (isVowel(charLast1) && isVowel(charAhead1)) {
						metaString += 'R';
						i++;

						/* todo o resto, como em arsenico */
					} else {
						metaString += 'R';
					}

					break;

				case 'Z':
					charAhead1 = strAnalise.charAt(i + 1);

					/* termina com, como em algoz */
					if (isWordEdge(charAhead1)) {
						metaString += 'S';
					} else {
						metaString += 'Z';
					}
					break;

				case 'N':
					charAhead1 = strAnalise.charAt(i + 1);

					/*
					 * no português, todas as palavras terminam com 'M', exceto no
					 * caso de nomes próprios, ou estrangeiros. Para todo caso, tem
					 * som de 'M'
					 */
					if (isWordEdge(charAhead1)) {
						metaString += 'M';
					}
					/* aranha, nhoque, manha */
					else if (charAhead1 == 'H') {
						metaString += '3';
						i++;
					}
					/* duplicado... */
					else if (charLast1 != 'N') {
						metaString += 'N';
					}
					break;

				case 'S':
					charAhead1 = strAnalise.charAt(i + 1);

					/* aSSar */
					if (charAhead1 == 'S') {
						metaString += 'S';
						charLast1 = charAhead1;
						i++;
					}
					/*
					 * mais estrangeirismo: sheila, mishel, e compatibilidade sonora
					 * com sobrenomes estrangeiros (japoneses)
					 */
					else if (charAhead1 == 'H') {
						metaString += 'X';
						i++;
					}
					/* como em asa */
					else if (isVowel(charLast1) && isVowel(charAhead1)) {
						metaString += 'Z';
					}
					/* special cases = 'SC' */
					else if (charAhead1 == 'C') {
						charAhead2 = strAnalise.charAt(i + 2);
						switch (charAhead2) { /* aSCEnder, laSCIvia */
						case 'E':
						case 'I':
							metaString += 'S';
							i += 2;
							break;

						/* maSCAvo, aSCO, auSCUltar */
						case 'A':
						case 'O':
						case 'U':
							metaString += 'SK';
							i += 2;
							break;

						/* estrangeirismo tal como scheila. */
						case 'H':
							metaString += 'X';
							i += 2;
							break;

						/* mesclado */
						default:
							metaString += 'S';
							i++;
							break;
						}
					} else {
						/* pega o resto - deve pegar atrás e sapato */
						metaString += 'S';
					}
					break;

				/* muitas, mas muitas exceções mesmo... ahh! */
				case 'X': {
					charLast2 = strAnalise.charAt(i - 2);
					charAhead1 = strAnalise.charAt(i + 1);

					/* fax, anticlímax e todos terminados com 'X' */
					if (isWordEdge(charAhead1)) {
						/* como em: Felix, Alex */
						/*
						 * o som destes casos: "KS" para manter compatibilidade com
						 * outra implementação, usar abaixo X Na verdade, para o
						 * computador tanto faz. Se todos usarem o mesmo
						 * significado, o computador sabe q são iguais, não que som
						 * q tem. A discussão está na representação acurada ou não
						 * da fonética.
						 */
						metaString += 'X';
					}
					/* ...ex... */
					else if (charLast1 == 'E') {
						if (isVowel(charAhead1)) {
							/*
							 * começados com EX. Exonerar, exército, executar,
							 * exemplo, exame, exílio, exuberar = ^ex + vogal
							 */
							if (isWordEdge(charLast2)) {
								/* deixado com o som original dele */
								metaString += 'Z';
							} else {
								switch (charAhead1) {
								case 'E':
								case 'I':
									/* México, mexerica, mexer */
									metaString += 'X';
									i++;
									break;
								default:
									/*
									 * Anexar, sexo, convexo, nexo, circunflexo
									 * sexual inclusive Alex e Alexandre, o que eh
									 * bom, pois há Aleksandro ou Alex sandro OBS:
									 * texugo cai aqui.
									 */
									metaString += 'KS';
									i++;
									break;
								}
							}
							// Ï
						}
						/* exceção, exceto */
						else if (charAhead1 == 'C') {
							metaString += 'S';
							i++;
							/*
							 * expatriar, experimentar, extensão, exterminar.
							 * Infelizmente, êxtase cai aqui
							 */
						} else if (charAhead1 == 'P' || charAhead1 == 'T') {
							metaString += 'S';
						}
						/* o resto... */
						else {
							metaString += 'KS';
						}
					}
					/*
					 * parece que certas sílabas predecessoras do 'x' como 'ca' em
					 * 'abacaxi' provocam o som de 'CH' no 'x'. com exceção do 'm',
					 * q é mais complexo.
					 */
					else if (isVowel(charLast1)) {
						/* faxina. Fax é tratado acima. */
						switch (charLast2) {
						/* encontros vocálicos */
						case 'A':
						case 'E':
						case 'I':
						case 'O':
						case 'U': /*
									 * caixa, trouxe, abaixar, frouxo, guaxo,
									 * Teixeira
									 */
						case 'C': /* coxa, abacaxi */
						case 'K':
						case 'G': /* gaxeta */
						case 'L': /* laxante, lixa, lixo */
						case 'R': /* roxo, bruxa */
						case 'X': /* xaxim */
							metaString += 'X';
							break;

						default:
							/*
							 * táxi, axila, axioma, tóxico, fixar, fixo, monóxido,
							 * óxido
							 */
							/*
							 * maxilar e enquadra máximo aqui tb, embora não seja
							 * correto.
							 */
							metaString += 'KS';
							break;
						}
					}
					/* tudo o mais... enxame, enxada, -- :( */
					else {
						metaString += 'X';
					}
				}
					break;

				/* ca, ce, ci, co, cu */
				case 'C':
					charAhead1 = strAnalise.charAt(i + 1);
					switch (charAhead1) {
					case 'E':
					case 'I':
						metaString += 'S';
						break;

					case 'H':
						/* christiano. */
						if (strAnalise.charAt(i + 2) == 'R') {
							metaString += 'K';
						}
						/* CHapéu, chuva */
						else {
							metaString += 'X';
						}
						i++;
						break;

					/*
					 * Jacques - não fazer nada. Deixa o 'Q' cuidar disso ou
					 * palavras com CK, mesma coisa.
					 */
					case 'Q':
					case 'K':
						break;

					default:
						metaString += 'K';
						break;
					}

					break;

				/*
				 * Se 'H' começar a palavrar, considerar as vogais que vierem depois
				 */
				case 'H':
					if (isWordEdge(charLast1)) {
						charAhead1 = strAnalise.charAt(i + 1);
						if (isVowel(charAhead1)) {
							metaString += charAhead1;
							/*
							 * Ex: HOSANA será mapeada para som de 'S', ao invés de
							 * 'Z'. OBS: para voltar à representação de Z, comente a
							 * linha abaixo
							 */
							i++;
						}
					}
					break;

				case 'Q':
					metaString += 'K';
					break;

				case 'W':
					charAhead1 = strAnalise.charAt(i + 1);
					if (isVowel(charAhead1)) {
						metaString += 'V';
					}
					/*
					 * desconsiderar o W no final das palavras, por ter som de U, ou
					 * ainda seguidos por consoantes, por ter som de U (Newton)
					 * 
					 * soluções para www?
					 */
					break;

				case 'Ç':
					metaString += 'S';
					break;

				}
				/* next char */
				i++;

				charLast1 = charCurrent;
			}
			return metaString;
		}
		return metaphoneptbr;
	}();
	
	// Testa para a palavra 'Metaphone'
	// console.log('Testando Metaphone para a palavra '
	//			+ 'Metaphone que é ' 
	// 			+ Y.Metaphone.getMeta('Metaphone'));

}, '1.0.0', {
	requires : [ 'node' ]
});
