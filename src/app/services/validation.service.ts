import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastController, LoadingController, Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { commonService } from './serviceFile';
// import { FCM } from '@ionic-native/fcm/ngx';
@Injectable({
  providedIn: 'root'
})
export class validationService {
  dataStoreFlag: boolean;
  FCMId: any;
  stageId: any;
  _newstageid;
  loading: any;
  token: any
  isLoading = false;
  userObj: any;
  paramData: any = {};
  paramID: Number = 0;
  countryCode = [
    {
      "name": "Afghanistan",
      "dial_code": "+93",
      "code": "AF"
    },
    {
      "name": "Aland Islands",
      "dial_code": "+358",
      "code": "AX"
    },
    {
      "name": "Albania",
      "dial_code": "+355",
      "code": "AL"
    },
    {
      "name": "Algeria",
      "dial_code": "+213",
      "code": "DZ"
    },
    {
      "name": "AmericanSamoa",
      "dial_code": "+1684",
      "code": "AS"
    },
    {
      "name": "Andorra",
      "dial_code": "+376",
      "code": "AD"
    },
    {
      "name": "Angola",
      "dial_code": "+244",
      "code": "AO"
    },
    {
      "name": "Anguilla",
      "dial_code": "+1264",
      "code": "AI"
    },
    {
      "name": "Antarctica",
      "dial_code": "+672",
      "code": "AQ"
    },
    {
      "name": "Antigua and Barbuda",
      "dial_code": "+1268",
      "code": "AG"
    },
    {
      "name": "Argentina",
      "dial_code": "+54",
      "code": "AR"
    },
    {
      "name": "Armenia",
      "dial_code": "+374",
      "code": "AM"
    },
    {
      "name": "Aruba",
      "dial_code": "+297",
      "code": "AW"
    },
    {
      "name": "Australia",
      "dial_code": "+61",
      "code": "AU"
    },
    {
      "name": "Austria",
      "dial_code": "+43",
      "code": "AT"
    },
    {
      "name": "Azerbaijan",
      "dial_code": "+994",
      "code": "AZ"
    },
    {
      "name": "Bahamas",
      "dial_code": "+1242",
      "code": "BS"
    },
    {
      "name": "Bahrain",
      "dial_code": "+973",
      "code": "BH"
    },
    {
      "name": "Bangladesh",
      "dial_code": "+880",
      "code": "BD"
    },
    {
      "name": "Barbados",
      "dial_code": "+1246",
      "code": "BB"
    },
    {
      "name": "Belarus",
      "dial_code": "+375",
      "code": "BY"
    },
    {
      "name": "Belgium",
      "dial_code": "+32",
      "code": "BE"
    },
    {
      "name": "Belize",
      "dial_code": "+501",
      "code": "BZ"
    },
    {
      "name": "Benin",
      "dial_code": "+229",
      "code": "BJ"
    },
    {
      "name": "Bermuda",
      "dial_code": "+1441",
      "code": "BM"
    },
    {
      "name": "Bhutan",
      "dial_code": "+975",
      "code": "BT"
    },
    {
      "name": "Bolivia, Plurinational State of Bolivia",
      "dial_code": "+591",
      "code": "BO"
    },
    {
      "name": "Bosnia and Herzegovina",
      "dial_code": "+387",
      "code": "BA"
    },
    {
      "name": "Botswana",
      "dial_code": "+267",
      "code": "BW"
    },
    {
      "name": "Bouvet Island",
      "dial_code": "+47",
      "code": "BV"
    },
    {
      "name": "Brazil",
      "dial_code": "+55",
      "code": "BR"
    },
    {
      "name": "British Indian Ocean Territory",
      "dial_code": "+246",
      "code": "IO"
    },
    {
      "name": "Brunei Darussalam",
      "dial_code": "+673",
      "code": "BN"
    },
    {
      "name": "Bulgaria",
      "dial_code": "+359",
      "code": "BG"
    },
    {
      "name": "Burkina Faso",
      "dial_code": "+226",
      "code": "BF"
    },
    {
      "name": "Burundi",
      "dial_code": "+257",
      "code": "BI"
    },
    {
      "name": "Cambodia",
      "dial_code": "+855",
      "code": "KH"
    },
    {
      "name": "Cameroon",
      "dial_code": "+237",
      "code": "CM"
    },
    {
      "name": "Canada",
      "dial_code": "+1",
      "code": "CA"
    },
    {
      "name": "Cape Verde",
      "dial_code": "+238",
      "code": "CV"
    },
    {
      "name": "Cayman Islands",
      "dial_code": "+1345",
      "code": "KY"
    },
    {
      "name": "Central African Republic",
      "dial_code": "+236",
      "code": "CF"
    },
    {
      "name": "Chad",
      "dial_code": "+235",
      "code": "TD"
    },
    {
      "name": "Chile",
      "dial_code": "+56",
      "code": "CL"
    },
    {
      "name": "China",
      "dial_code": "+86",
      "code": "CN"
    },
    {
      "name": "Christmas Island",
      "dial_code": "+61",
      "code": "CX"
    },
    {
      "name": "Cocos (Keeling) Islands",
      "dial_code": "+61",
      "code": "CC"
    },
    {
      "name": "Colombia",
      "dial_code": "+57",
      "code": "CO"
    },
    {
      "name": "Comoros",
      "dial_code": "+269",
      "code": "KM"
    },
    {
      "name": "Congo",
      "dial_code": "+242",
      "code": "CG"
    },
    {
      "name": "Congo, The Democratic Republic of the Congo",
      "dial_code": "+243",
      "code": "CD"
    },
    {
      "name": "Cook Islands",
      "dial_code": "+682",
      "code": "CK"
    },
    {
      "name": "Costa Rica",
      "dial_code": "+506",
      "code": "CR"
    },
    {
      "name": "Cote d'Ivoire",
      "dial_code": "+225",
      "code": "CI"
    },
    {
      "name": "Croatia",
      "dial_code": "+385",
      "code": "HR"
    },
    {
      "name": "Cuba",
      "dial_code": "+53",
      "code": "CU"
    },
    {
      "name": "Cyprus",
      "dial_code": "+357",
      "code": "CY"
    },
    {
      "name": "Czech Republic",
      "dial_code": "+420",
      "code": "CZ"
    },
    {
      "name": "Denmark",
      "dial_code": "+45",
      "code": "DK"
    },
    {
      "name": "Djibouti",
      "dial_code": "+253",
      "code": "DJ"
    },
    {
      "name": "Dominica",
      "dial_code": "+1767",
      "code": "DM"
    },
    {
      "name": "Dominican Republic",
      "dial_code": "+1849",
      "code": "DO"
    },
    {
      "name": "Ecuador",
      "dial_code": "+593",
      "code": "EC"
    },
    {
      "name": "Egypt",
      "dial_code": "+20",
      "code": "EG"
    },
    {
      "name": "El Salvador",
      "dial_code": "+503",
      "code": "SV"
    },
    {
      "name": "Equatorial Guinea",
      "dial_code": "+240",
      "code": "GQ"
    },
    {
      "name": "Eritrea",
      "dial_code": "+291",
      "code": "ER"
    },
    {
      "name": "Estonia",
      "dial_code": "+372",
      "code": "EE"
    },
    {
      "name": "Ethiopia",
      "dial_code": "+251",
      "code": "ET"
    },
    {
      "name": "Falkland Islands (Malvinas)",
      "dial_code": "+500",
      "code": "FK"
    },
    {
      "name": "Faroe Islands",
      "dial_code": "+298",
      "code": "FO"
    },
    {
      "name": "Fiji",
      "dial_code": "+679",
      "code": "FJ"
    },
    {
      "name": "Finland",
      "dial_code": "+358",
      "code": "FI"
    },
    {
      "name": "France",
      "dial_code": "+33",
      "code": "FR"
    },
    {
      "name": "French Guiana",
      "dial_code": "+594",
      "code": "GF"
    },
    {
      "name": "French Polynesia",
      "dial_code": "+689",
      "code": "PF"
    },
    {
      "name": "Gabon",
      "dial_code": "+241",
      "code": "GA"
    },
    {
      "name": "Gambia",
      "dial_code": "+220",
      "code": "GM"
    },
    {
      "name": "Georgia",
      "dial_code": "+995",
      "code": "GE"
    },
    {
      "name": "Germany",
      "dial_code": "+49",
      "code": "DE"
    },
    {
      "name": "Ghana",
      "dial_code": "+233",
      "code": "GH"
    },
    {
      "name": "Gibraltar",
      "dial_code": "+350",
      "code": "GI"
    },
    {
      "name": "Greece",
      "dial_code": "+30",
      "code": "GR"
    },
    {
      "name": "Greenland",
      "dial_code": "+299",
      "code": "GL"
    },
    {
      "name": "Grenada",
      "dial_code": "+1473",
      "code": "GD"
    },
    {
      "name": "Guadeloupe",
      "dial_code": "+590",
      "code": "GP"
    },
    {
      "name": "Guam",
      "dial_code": "+1671",
      "code": "GU"
    },
    {
      "name": "Guatemala",
      "dial_code": "+502",
      "code": "GT"
    },
    {
      "name": "Guernsey",
      "dial_code": "+44",
      "code": "GG"
    },
    {
      "name": "Guinea",
      "dial_code": "+224",
      "code": "GN"
    },
    {
      "name": "Guinea-Bissau",
      "dial_code": "+245",
      "code": "GW"
    },
    {
      "name": "Guyana",
      "dial_code": "+592",
      "code": "GY"
    },
    {
      "name": "Haiti",
      "dial_code": "+509",
      "code": "HT"
    },
    {
      "name": "Heard Island and Mcdonald Islands",
      "dial_code": "+672",
      "code": "HM"
    },
    {
      "name": "Holy See (Vatican City State)",
      "dial_code": "+379",
      "code": "VA"
    },
    {
      "name": "Honduras",
      "dial_code": "+504",
      "code": "HN"
    },
    {
      "name": "Hong Kong",
      "dial_code": "+852",
      "code": "HK"
    },
    {
      "name": "Hungary",
      "dial_code": "+36",
      "code": "HU"
    },
    {
      "name": "Iceland",
      "dial_code": "+354",
      "code": "IS"
    },
    {
      "name": "India",
      "dial_code": "+91",
      "code": "IN"
    },
    {
      "name": "Indonesia",
      "dial_code": "+62",
      "code": "ID"
    },
    {
      "name": "Iran, Islamic Republic of Persian Gulf",
      "dial_code": "+98",
      "code": "IR"
    },
    {
      "name": "Iraq",
      "dial_code": "+964",
      "code": "IQ"
    },
    {
      "name": "Ireland",
      "dial_code": "+353",
      "code": "IE"
    },
    {
      "name": "Isle of Man",
      "dial_code": "+44",
      "code": "IM"
    },
    {
      "name": "Israel",
      "dial_code": "+972",
      "code": "IL"
    },
    {
      "name": "Italy",
      "dial_code": "+39",
      "code": "IT"
    },
    {
      "name": "Jamaica",
      "dial_code": "+1876",
      "code": "JM"
    },
    {
      "name": "Japan",
      "dial_code": "+81",
      "code": "JP"
    },
    {
      "name": "Jersey",
      "dial_code": "+44",
      "code": "JE"
    },
    {
      "name": "Jordan",
      "dial_code": "+962",
      "code": "JO"
    },
    {
      "name": "Kazakhstan",
      "dial_code": "+77",
      "code": "KZ"
    },
    {
      "name": "Kenya",
      "dial_code": "+254",
      "code": "KE"
    },
    {
      "name": "Kiribati",
      "dial_code": "+686",
      "code": "KI"
    },
    {
      "name": "Korea, Democratic People's Republic of Korea",
      "dial_code": "+850",
      "code": "KP"
    },
    {
      "name": "Korea, Republic of South Korea",
      "dial_code": "+82",
      "code": "KR"
    },
    {
      "name": "Kosovo",
      "dial_code": "+383",
      "code": "XK"
    },
    {
      "name": "Kuwait",
      "dial_code": "+965",
      "code": "KW"
    },
    {
      "name": "Kyrgyzstan",
      "dial_code": "+996",
      "code": "KG"
    },
    {
      "name": "Laos",
      "dial_code": "+856",
      "code": "LA"
    },
    {
      "name": "Latvia",
      "dial_code": "+371",
      "code": "LV"
    },
    {
      "name": "Lebanon",
      "dial_code": "+961",
      "code": "LB"
    },
    {
      "name": "Lesotho",
      "dial_code": "+266",
      "code": "LS"
    },
    {
      "name": "Liberia",
      "dial_code": "+231",
      "code": "LR"
    },
    {
      "name": "Libyan Arab Jamahiriya",
      "dial_code": "+218",
      "code": "LY"
    },
    {
      "name": "Liechtenstein",
      "dial_code": "+423",
      "code": "LI"
    },
    {
      "name": "Lithuania",
      "dial_code": "+370",
      "code": "LT"
    },
    {
      "name": "Luxembourg",
      "dial_code": "+352",
      "code": "LU"
    },
    {
      "name": "Macao",
      "dial_code": "+853",
      "code": "MO"
    },
    {
      "name": "Macedonia",
      "dial_code": "+389",
      "code": "MK"
    },
    {
      "name": "Madagascar",
      "dial_code": "+261",
      "code": "MG"
    },
    {
      "name": "Malawi",
      "dial_code": "+265",
      "code": "MW"
    },
    {
      "name": "Malaysia",
      "dial_code": "+60",
      "code": "MY"
    },
    {
      "name": "Maldives",
      "dial_code": "+960",
      "code": "MV"
    },
    {
      "name": "Mali",
      "dial_code": "+223",
      "code": "ML"
    },
    {
      "name": "Malta",
      "dial_code": "+356",
      "code": "MT"
    },
    {
      "name": "Marshall Islands",
      "dial_code": "+692",
      "code": "MH"
    },
    {
      "name": "Martinique",
      "dial_code": "+596",
      "code": "MQ"
    },
    {
      "name": "Mauritania",
      "dial_code": "+222",
      "code": "MR"
    },
    {
      "name": "Mauritius",
      "dial_code": "+230",
      "code": "MU"
    },
    {
      "name": "Mayotte",
      "dial_code": "+262",
      "code": "YT"
    },
    {
      "name": "Mexico",
      "dial_code": "+52",
      "code": "MX"
    },
    {
      "name": "Micronesia, Federated States of Micronesia",
      "dial_code": "+691",
      "code": "FM"
    },
    {
      "name": "Moldova",
      "dial_code": "+373",
      "code": "MD"
    },
    {
      "name": "Monaco",
      "dial_code": "+377",
      "code": "MC"
    },
    {
      "name": "Mongolia",
      "dial_code": "+976",
      "code": "MN"
    },
    {
      "name": "Montenegro",
      "dial_code": "+382",
      "code": "ME"
    },
    {
      "name": "Montserrat",
      "dial_code": "+1664",
      "code": "MS"
    },
    {
      "name": "Morocco",
      "dial_code": "+212",
      "code": "MA"
    },
    {
      "name": "Mozambique",
      "dial_code": "+258",
      "code": "MZ"
    },
    {
      "name": "Myanmar",
      "dial_code": "+95",
      "code": "MM"
    },
    {
      "name": "Namibia",
      "dial_code": "+264",
      "code": "NA"
    },
    {
      "name": "Nauru",
      "dial_code": "+674",
      "code": "NR"
    },
    {
      "name": "Nepal",
      "dial_code": "+977",
      "code": "NP"
    },
    {
      "name": "Netherlands",
      "dial_code": "+31",
      "code": "NL"
    },
    {
      "name": "Netherlands Antilles",
      "dial_code": "+599",
      "code": "AN"
    },
    {
      "name": "New Caledonia",
      "dial_code": "+687",
      "code": "NC"
    },
    {
      "name": "New Zealand",
      "dial_code": "+64",
      "code": "NZ"
    },
    {
      "name": "Nicaragua",
      "dial_code": "+505",
      "code": "NI"
    },
    {
      "name": "Niger",
      "dial_code": "+227",
      "code": "NE"
    },
    {
      "name": "Nigeria",
      "dial_code": "+234",
      "code": "NG"
    },
    {
      "name": "Niue",
      "dial_code": "+683",
      "code": "NU"
    },
    {
      "name": "Norfolk Island",
      "dial_code": "+672",
      "code": "NF"
    },
    {
      "name": "Northern Mariana Islands",
      "dial_code": "+1670",
      "code": "MP"
    },
    {
      "name": "Norway",
      "dial_code": "+47",
      "code": "NO"
    },
    {
      "name": "Oman",
      "dial_code": "+968",
      "code": "OM"
    },
    {
      "name": "Pakistan",
      "dial_code": "+92",
      "code": "PK"
    },
    {
      "name": "Palau",
      "dial_code": "+680",
      "code": "PW"
    },
    {
      "name": "Palestinian Territory, Occupied",
      "dial_code": "+970",
      "code": "PS"
    },
    {
      "name": "Panama",
      "dial_code": "+507",
      "code": "PA"
    },
    {
      "name": "Papua New Guinea",
      "dial_code": "+675",
      "code": "PG"
    },
    {
      "name": "Paraguay",
      "dial_code": "+595",
      "code": "PY"
    },
    {
      "name": "Peru",
      "dial_code": "+51",
      "code": "PE"
    },
    {
      "name": "Philippines",
      "dial_code": "+63",
      "code": "PH"
    },
    {
      "name": "Pitcairn",
      "dial_code": "+64",
      "code": "PN"
    },
    {
      "name": "Poland",
      "dial_code": "+48",
      "code": "PL"
    },
    {
      "name": "Portugal",
      "dial_code": "+351",
      "code": "PT"
    },
    {
      "name": "Puerto Rico",
      "dial_code": "+1939",
      "code": "PR"
    },
    {
      "name": "Qatar",
      "dial_code": "+974",
      "code": "QA"
    },
    {
      "name": "Romania",
      "dial_code": "+40",
      "code": "RO"
    },
    {
      "name": "Russia",
      "dial_code": "+7",
      "code": "RU"
    },
    {
      "name": "Rwanda",
      "dial_code": "+250",
      "code": "RW"
    },
    {
      "name": "Reunion",
      "dial_code": "+262",
      "code": "RE"
    },
    {
      "name": "Saint Barthelemy",
      "dial_code": "+590",
      "code": "BL"
    },
    {
      "name": "Saint Helena, Ascension and Tristan Da Cunha",
      "dial_code": "+290",
      "code": "SH"
    },
    {
      "name": "Saint Kitts and Nevis",
      "dial_code": "+1869",
      "code": "KN"
    },
    {
      "name": "Saint Lucia",
      "dial_code": "+1758",
      "code": "LC"
    },
    {
      "name": "Saint Martin",
      "dial_code": "+590",
      "code": "MF"
    },
    {
      "name": "Saint Pierre and Miquelon",
      "dial_code": "+508",
      "code": "PM"
    },
    {
      "name": "Saint Vincent and the Grenadines",
      "dial_code": "+1784",
      "code": "VC"
    },
    {
      "name": "Samoa",
      "dial_code": "+685",
      "code": "WS"
    },
    {
      "name": "San Marino",
      "dial_code": "+378",
      "code": "SM"
    },
    {
      "name": "Sao Tome and Principe",
      "dial_code": "+239",
      "code": "ST"
    },
    {
      "name": "Saudi Arabia",
      "dial_code": "+966",
      "code": "SA"
    },
    {
      "name": "Senegal",
      "dial_code": "+221",
      "code": "SN"
    },
    {
      "name": "Serbia",
      "dial_code": "+381",
      "code": "RS"
    },
    {
      "name": "Seychelles",
      "dial_code": "+248",
      "code": "SC"
    },
    {
      "name": "Sierra Leone",
      "dial_code": "+232",
      "code": "SL"
    },
    {
      "name": "Singapore",
      "dial_code": "+65",
      "code": "SG"
    },
    {
      "name": "Slovakia",
      "dial_code": "+421",
      "code": "SK"
    },
    {
      "name": "Slovenia",
      "dial_code": "+386",
      "code": "SI"
    },
    {
      "name": "Solomon Islands",
      "dial_code": "+677",
      "code": "SB"
    },
    {
      "name": "Somalia",
      "dial_code": "+252",
      "code": "SO"
    },
    {
      "name": "South Africa",
      "dial_code": "+27",
      "code": "ZA"
    },
    {
      "name": "South Sudan",
      "dial_code": "+211",
      "code": "SS"
    },
    {
      "name": "South Georgia and the South Sandwich Islands",
      "dial_code": "+500",
      "code": "GS"
    },
    {
      "name": "Spain",
      "dial_code": "+34",
      "code": "ES"
    },
    {
      "name": "Sri Lanka",
      "dial_code": "+94",
      "code": "LK"
    },
    {
      "name": "Sudan",
      "dial_code": "+249",
      "code": "SD"
    },
    {
      "name": "Suriname",
      "dial_code": "+597",
      "code": "SR"
    },
    {
      "name": "Svalbard and Jan Mayen",
      "dial_code": "+47",
      "code": "SJ"
    },
    {
      "name": "Swaziland",
      "dial_code": "+268",
      "code": "SZ"
    },
    {
      "name": "Sweden",
      "dial_code": "+46",
      "code": "SE"
    },
    {
      "name": "Switzerland",
      "dial_code": "+41",
      "code": "CH"
    },
    {
      "name": "Syrian Arab Republic",
      "dial_code": "+963",
      "code": "SY"
    },
    {
      "name": "Taiwan",
      "dial_code": "+886",
      "code": "TW"
    },
    {
      "name": "Tajikistan",
      "dial_code": "+992",
      "code": "TJ"
    },
    {
      "name": "Tanzania, United Republic of Tanzania",
      "dial_code": "+255",
      "code": "TZ"
    },
    {
      "name": "Thailand",
      "dial_code": "+66",
      "code": "TH"
    },
    {
      "name": "Timor-Leste",
      "dial_code": "+670",
      "code": "TL"
    },
    {
      "name": "Togo",
      "dial_code": "+228",
      "code": "TG"
    },
    {
      "name": "Tokelau",
      "dial_code": "+690",
      "code": "TK"
    },
    {
      "name": "Tonga",
      "dial_code": "+676",
      "code": "TO"
    },
    {
      "name": "Trinidad and Tobago",
      "dial_code": "+1868",
      "code": "TT"
    },
    {
      "name": "Tunisia",
      "dial_code": "+216",
      "code": "TN"
    },
    {
      "name": "Turkey",
      "dial_code": "+90",
      "code": "TR"
    },
    {
      "name": "Turkmenistan",
      "dial_code": "+993",
      "code": "TM"
    },
    {
      "name": "Turks and Caicos Islands",
      "dial_code": "+1649",
      "code": "TC"
    },
    {
      "name": "Tuvalu",
      "dial_code": "+688",
      "code": "TV"
    },
    {
      "name": "Uganda",
      "dial_code": "+256",
      "code": "UG"
    },
    {
      "name": "Ukraine",
      "dial_code": "+380",
      "code": "UA"
    },
    {
      "name": "United Arab Emirates",
      "dial_code": "+971",
      "code": "AE"
    },
    {
      "name": "United Kingdom",
      "dial_code": "+44",
      "code": "GB"
    },
    {
      "name": "United States",
      "dial_code": "+1",
      "code": "US"
    },
    {
      "name": "Uruguay",
      "dial_code": "+598",
      "code": "UY"
    },
    {
      "name": "Uzbekistan",
      "dial_code": "+998",
      "code": "UZ"
    },
    {
      "name": "Vanuatu",
      "dial_code": "+678",
      "code": "VU"
    },
    {
      "name": "Venezuela, Bolivarian Republic of Venezuela",
      "dial_code": "+58",
      "code": "VE"
    },
    {
      "name": "Vietnam",
      "dial_code": "+84",
      "code": "VN"
    },
    {
      "name": "Virgin Islands, British",
      "dial_code": "+1284",
      "code": "VG"
    },
    {
      "name": "Virgin Islands, U.S.",
      "dial_code": "+1340",
      "code": "VI"
    },
    {
      "name": "Wallis and Futuna",
      "dial_code": "+681",
      "code": "WF"
    },
    {
      "name": "Yemen",
      "dial_code": "+967",
      "code": "YE"
    },
    {
      "name": "Zambia",
      "dial_code": "+260",
      "code": "ZM"
    },
    {
      "name": "Zimbabwe",
      "dial_code": "+263",
      "code": "ZW"
    }
  ]
  stateCode = [
    {
      "code": "AN",
      "name": "Andaman and Nicobar Islands"
    },
    {
      "code": "AP",
      "name": "Andhra Pradesh"
    },
    {
      "code": "AR",
      "name": "Arunachal Pradesh"
    },
    {
      "code": "AS",
      "name": "Assam"
    },
    {
      "code": "BR",
      "name": "Bihar"
    },
    {
      "code": "CG",
      "name": "Chandigarh"
    },
    {
      "code": "CH",
      "name": "Chhattisgarh"
    },
    {
      "code": "DH",
      "name": "Dadra and Nagar Haveli"
    },
    {
      "code": "DD",
      "name": "Daman and Diu"
    },
    {
      "code": "DL",
      "name": "Delhi"
    },
    {
      "code": "GA",
      "name": "Goa"
    },
    {
      "code": "GJ",
      "name": "Gujarat"
    },
    {
      "code": "HR",
      "name": "Haryana"
    },
    {
      "code": "HP",
      "name": "Himachal Pradesh"
    },
    {
      "code": "JK",
      "name": "Jammu and Kashmir"
    },
    {
      "code": "JH",
      "name": "Jharkhand"
    },
    {
      "code": "KA",
      "name": "Karnataka"
    },
    {
      "code": "KL",
      "name": "Kerala"
    },
    {
      "code": "LD",
      "name": "Lakshadweep"
    },
    {
      "code": "MP",
      "name": "Madhya Pradesh"
    },
    {
      "code": "MH",
      "name": "Maharashtra"
    },
    {
      "code": "MN",
      "name": "Manipur"
    },
    {
      "code": "ML",
      "name": "Meghalaya"
    },
    {
      "code": "MZ",
      "name": "Mizoram"
    },
    {
      "code": "NL",
      "name": "Nagaland"
    },
    {
      "code": "OR",
      "name": "Odisha"
    },
    {
      "code": "PY",
      "name": "Puducherry"
    },
    {
      "code": "PB",
      "name": "Punjab"
    },
    {
      "code": "RJ",
      "name": "Rajasthan"
    },
    {
      "code": "SK",
      "name": "Sikkim"
    },
    {
      "code": "TN",
      "name": "Tamil Nadu"
    },
    {
      "code": "TS",
      "name": "Telangana"
    },
    {
      "code": "TR",
      "name": "Tripura"
    },
    {
      "code": "UP",
      "name": "Uttar Pradesh"
    },
    {
      "code": "UK",
      "name": "Uttarakhand"
    },
    {
      "code": "WB",
      "name": "West Bengal"
    }
  ]

  paymentKey = "rzp_test_iz8e3ZUC8YJy1y"

  constructor(public http: HttpClient,
    private toastCtrl: ToastController,
    private storage: Storage,
    public loadingCtrl: LoadingController,
    private platform: Platform,
    ) {

    storage.get('token').then((val) => {

      if (val) {
        this.token = val
      } else {

      }
    });

    this.storage.get('userObj').then((val) => {

      if (val != {} && val != null) {
        this.userObj = JSON.parse(val)

      } else {
      }
    });
  }
  setNewStageId(stageId) {
    localStorage.setItem("stageId", stageId);

  }
  getNewStageId() {
    let stageId;
    stageId = localStorage.getItem('stageId');
    return stageId;
  }
  async getLoderObj() {
    const loading = await this.loadingCtrl.create({
      message: '',
      spinner: 'bubbles'
    });
  }
  async presentLoading(message: string = null, duration: number = null) {
    this.isLoading = true;
    return await this.loadingCtrl.create({
      spinner: 'bubbles'
    }).then(a => {
      a.present().then(() => {
        if (!this.isLoading) {
          a.dismiss();
        }
      });
    });
  }
  async dismissLoading() {
    this.isLoading = false;
    return await this.loadingCtrl.dismiss({ confirmed: this.isLoading }).then();
  }
  async presentToast(message) {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 500,
      position: 'bottom',
    });
    toast.present();
  }
  setStageId(val) {
    this.stageId = val;
  }
  setStageIdInStorage(val) {
    this.storage.set('stageId', val);
    this.stageId = val;
  }
  getStageId() {
    return this.stageId;
  }
  setDataStoreFlag(val) {
    this.dataStoreFlag = val;
  }
  setDataStoreFlagInStorage(val) {
    this.storage.set('dataStoreFlag', val);
    this.dataStoreFlag = val;
  }
  isDataStore() {
    return this.dataStoreFlag;
  }
  setFCMId() {
    /*this.FCMId = val;
    this.fcm.getToken().then(token => {
      alert(token)
      this.FCMId = token;
      return this.FCMId;
    })*/
    
  }
  getFCMId() {
    this.storage.get('fcmId').then((val) => {
      console.log(val)
      if (val) {
        return val;
      } else {
      }
    });
  }
  getDeviceType() {
    let DeviceType = "UUID";
    if (!(this.platform.is("mobileweb"))) {
      return DeviceType = "mobileweb";
    } else if (!(this.platform.is("desktop"))) {
      return DeviceType = "desktop";
    } else if (!(this.platform.is("ios"))) {
      return DeviceType = "ios";
    } else if (!(this.platform.is("tablet"))) {
      return DeviceType = "tablet";
    } else if (!(this.platform.is("android"))) {
      return DeviceType = "android";
    } else if (!(this.platform.is("mobile"))) {
      return DeviceType = "mobile";
    } else if (!(this.platform.is("cordova"))) {
      return DeviceType = "cordova";
    } else {
      return DeviceType = "nothing";
    }
  }
  // getFCMId() {
  //   return this.FCMId;
  // }
 
  setToken(val) {
    this.token = val;
    localStorage.setItem("token", JSON.stringify(this.token));
  }
  getToken() {
    this.token = localStorage.getItem("token");
    return this.token;
  }
  setUser(val) {
    this.userObj = val;
  }
  getUser() {

    return this.userObj;
  }
  setInDB(key, val) {
    this.storage.set(key, val);
  }

  isvalidEmail(email) {
    var regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(email);
  }
  getstatePrefix(data) {
    let statePrefix: any;
    statePrefix = this.stateCode.filter(state => state.name == data)
    return statePrefix[0].code;
  }
  getCountryCode(data) {
    let statePrefix: any;
    statePrefix = this.stateCode.filter(state => state.name == data)
    return statePrefix[0].code;
  }
  // logout() {
  //   const headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', this.getToken()).set("uuid", this.getUUID());
  //   this.commonService.get('retailer/logout/', {}, { headers: headers }).subscribe((data: any) => {
  //     if (data.successFlag == true) {
  // this.router.navigate([' '])
  //     }
  //   });
  // }
  getDogBreeds() {

    var dogbreeds = [
      "Affenpinscher",
      "Afghan Hound",
      "Aidi",
      "Airedale Terrier",
      "Akbash Dog",
      "Akita",
      "Alano Español",
      "Alaskan Klee Kai",
      "Alaskan Malamute",
      "Alpine Dachsbracke",
      "Alpine Spaniel",
      "American Bulldog",
      "American Cocker Spaniel",
      "American Eskimo Dog",
      "American Foxhound",
      "American Hairless Terrier",
      "American Pit Bull Terrier",
      "American Staffordshire Terrier",
      "American Water Spaniel",
      "Anglo-Français de Petite Vénerie",
      "Appenzeller Sennenhund",
      "Ariege Pointer",
      "Ariegeois",
      "Armant",
      "Armenian Gampr dog",
      "Artois Hound",
      "Australian Cattle Dog",
      "Australian Kelpie",
      "Australian Shepherd",
      "Australian Silky Terrier",
      "Australian Stumpy Tail Cattle Dog",
      "Australian Terrier",
      "Azawakh",
      "Bakharwal Dog",
      "Barbet",
      "Basenji",
      "Basque Shepherd Dog",
      "Basset Artésien Normand",
      "Basset Bleu de Gascogne",
      "Basset Fauve de Bretagne",
      "Basset Hound",
      "Bavarian Mountain Hound",
      "Beagle",
      "Beagle-Harrier",
      "Bearded Collie",
      "Beauceron",
      "Bedlington Terrier",
      "Belgian Shepherd Dog (Groenendael)",
      "Belgian Shepherd Dog (Laekenois)",
      "Belgian Shepherd Dog (Malinois)",
      "Bergamasco Shepherd",
      "Berger Blanc Suisse",
      "Berger Picard",
      "Berner Laufhund",
      "Bernese Mountain Dog",
      "Billy",
      "Black and Tan Coonhound",
      "Black and Tan Virginia Foxhound",
      "Black Norwegian Elkhound",
      "Black Russian Terrier",
      "Bloodhound",
      "Blue Lacy",
      "Blue Paul Terrier",
      "Boerboel",
      "Bohemian Shepherd",
      "Bolognese",
      "Border Collie",
      "Border Terrier",
      "Borzoi",
      "Boston Terrier",
      "Bouvier des Ardennes",
      "Bouvier des Flandres",
      "Boxer",
      "Boykin Spaniel",
      "Bracco Italiano",
      "Braque d'Auvergne",
      "Braque du Bourbonnais",
      "Braque du Puy",
      "Braque Francais",
      "Braque Saint-Germain",
      "Brazilian Terrier",
      "Briard",
      "Briquet Griffon Vendéen",
      "Brittany",
      "Broholmer",
      "Bruno Jura Hound",
      "Bucovina Shepherd Dog",
      "Bull and Terrier",
      "Bull Terrier (Miniature)",
      "Bull Terrier",
      "Bulldog",
      "Bullenbeisser",
      "Bullmastiff",
      "Bully Kutta",
      "Burgos Pointer",
      "Cairn Terrier",
      "Canaan Dog",
      "Canadian Eskimo Dog",
      "Cane Corso",
      "Cardigan Welsh Corgi",
      "Carolina Dog",
      "Carpathian Shepherd Dog",
      "Catahoula Cur",
      "Catalan Sheepdog",
      "Caucasian Shepherd Dog",
      "Cavalier King Charles Spaniel",
      "Central Asian Shepherd Dog",
      "Cesky Fousek",
      "Cesky Terrier",
      "Chesapeake Bay Retriever",
      "Chien Français Blanc et Noir",
      "Chien Français Blanc et Orange",
      "Chien Français Tricolore",
      "Chien-gris",
      "Chihuahua",
      "Chilean Fox Terrier",
      "Chinese Chongqing Dog",
      "Chinese Crested Dog",
      "Chinese Imperial Dog",
      "Chinook",
      "Chippiparai",
      "Chow Chow",
      "Cierny Sery",
      "Cimarrón Uruguayo",
      "Cirneco dell'Etna",
      "Clumber Spaniel",
      "Combai",
      "Cordoba Fighting Dog",
      "Coton de Tulear",
      "Cretan Hound",
      "Croatian Sheepdog",
      "Cumberland Sheepdog",
      "Curly Coated Retriever",
      "Cursinu",
      "Cão da Serra de Aires",
      "Cão de Castro Laboreiro",
      "Cão Fila de São Miguel",
      "Dachshund",
      "Dalmatian",
      "Dandie Dinmont Terrier",
      "Danish Swedish Farmdog",
      "Deutsche Bracke",
      "Doberman Pinscher",
      "Dogo Argentino",
      "Dogo Cubano",
      "Dogue de Bordeaux",
      "Drentse Patrijshond",
      "Drever",
      "Dunker",
      "Dutch Shepherd Dog",
      "Dutch Smoushond",
      "East Siberian Laika",
      "East-European Shepherd",
      "Elo",
      "English Cocker Spaniel",
      "English Foxhound",
      "English Mastiff",
      "English Setter",
      "English Shepherd",
      "English Springer Spaniel",
      "English Toy Terrier (Black &amp; Tan)",
      "English Water Spaniel",
      "English White Terrier",
      "Entlebucher Mountain Dog",
      "Estonian Hound",
      "Estrela Mountain Dog",
      "Eurasier",
      "Field Spaniel",
      "Fila Brasileiro",
      "Finnish Hound",
      "Finnish Lapphund",
      "Finnish Spitz",
      "Flat-Coated Retriever",
      "Formosan Mountain Dog",
      "Fox Terrier (Smooth)",
      "French Bulldog",
      "French Spaniel",
      "Galgo Español",
      "Gascon Saintongeois",
      "German Longhaired Pointer",
      "German Pinscher",
      "German Shepherd",
      "German Shorthaired Pointer",
      "German Spaniel",
      "German Spitz",
      "German Wirehaired Pointer",
      "Giant Schnauzer",
      "Glen of Imaal Terrier",
      "Golden Retriever",
      "Gordon Setter",
      "Gran Mastín de Borínquen",
      "Grand Anglo-Français Blanc et Noir",
      "Grand Anglo-Français Blanc et Orange",
      "Grand Anglo-Français Tricolore",
      "Grand Basset Griffon Vendéen",
      "Grand Bleu de Gascogne",
      "Grand Griffon Vendéen",
      "Great Dane",
      "Great Pyrenees",
      "Greater Swiss Mountain Dog",
      "Greek Harehound",
      "Greenland Dog",
      "Greyhound",
      "Griffon Bleu de Gascogne",
      "Griffon Bruxellois",
      "Griffon Fauve de Bretagne",
      "Griffon Nivernais",
      "Hamiltonstövare",
      "Hanover Hound",
      "Hare Indian Dog",
      "Harrier",
      "Havanese",
      "Hawaiian Poi Dog",
      "Himalayan Sheepdog",
      "Hokkaido",
      "Hovawart",
      "Huntaway",
      "Hygenhund",
      "Ibizan Hound",
      "Icelandic Sheepdog",
      "Indian pariah dog",
      "Indian Spitz",
      "Irish Red and White Setter",
      "Irish Setter",
      "Irish Terrier",
      "Irish Water Spaniel",
      "Irish Wolfhound",
      "Istrian Coarse-haired Hound",
      "Istrian Shorthaired Hound",
      "Italian Greyhound",
      "Jack Russell Terrier",
      "Jagdterrier",
      "Jämthund",
      "Kai Ken",
      "Kaikadi",
      "Kanni",
      "Karelian Bear Dog",
      "Karst Shepherd",
      "Keeshond",
      "Kerry Beagle",
      "Kerry Blue Terrier",
      "King Charles Spaniel",
      "King Shepherd",
      "Kintamani",
      "Kishu",
      "Komondor",
      "Kooikerhondje",
      "Koolie",
      "Korean Jindo Dog",
      "Kromfohrländer",
      "Kumaon Mastiff",
      "Kurī",
      "Kuvasz",
      "Kyi-Leo",
      "Labrador Husky",
      "Labrador Retriever",
      "Lagotto Romagnolo",
      "Lakeland Terrier",
      "Lancashire Heeler",
      "Landseer",
      "Lapponian Herder",
      "Large Münsterländer",
      "Leonberger",
      "Lhasa Apso",
      "Lithuanian Hound",
      "Longhaired Whippet",
      "Löwchen",
      "Mahratta Greyhound",
      "Maltese",
      "Manchester Terrier",
      "Maremma Sheepdog",
      "McNab",
      "Mexican Hairless Dog",
      "Miniature American Shepherd",
      "Miniature Australian Shepherd",
      "Miniature Fox Terrier",
      "Miniature Pinscher",
      "Miniature Schnauzer",
      "Miniature Shar Pei",
      "Molossus",
      "Montenegrin Mountain Hound",
      "Moscow Watchdog",
      "Moscow Water Dog",
      "Mountain Cur",
      "Mucuchies",
      "Mudhol Hound",
      "Mudi",
      "Neapolitan Mastiff",
      "New Zealand Heading Dog",
      "Newfoundland",
      "Norfolk Spaniel",
      "Norfolk Terrier",
      "Norrbottenspets",
      "North Country Beagle",
      "Northern Inuit Dog",
      "Norwegian Buhund",
      "Norwegian Elkhound",
      "Norwegian Lundehund",
      "Norwich Terrier",
      "Old Croatian Sighthound",
      "Old Danish Pointer",
      "Old English Sheepdog",
      "Old English Terrier",
      "Old German Shepherd Dog",
      "Olde English Bulldogge",
      "Otterhound",
      "Pachon Navarro",
      "Paisley Terrier",
      "Pandikona",
      "Papillon",
      "Parson Russell Terrier",
      "Patterdale Terrier",
      "Pekingese",
      "Pembroke Welsh Corgi",
      "Perro de Presa Canario",
      "Perro de Presa Mallorquin",
      "Peruvian Hairless Dog",
      "Petit Basset Griffon Vendéen",
      "Petit Bleu de Gascogne",
      "Phalène",
      "Pharaoh Hound",
      "Phu Quoc ridgeback dog",
      "Picardy Spaniel",
      "Plott Hound",
      "Podenco Canario",
      "Pointer (dog breed)",
      "Polish Greyhound",
      "Polish Hound",
      "Polish Hunting Dog",
      "Polish Lowland Sheepdog",
      "Polish Tatra Sheepdog",
      "Pomeranian",
      "Pont-Audemer Spaniel",
      "Poodle",
      "Porcelaine",
      "Portuguese Podengo",
      "Portuguese Pointer",
      "Portuguese Water Dog",
      "Posavac Hound",
      "Pražský Krysařík",
      "Pudelpointer",
      "Pug",
      "Puli",
      "Pumi",
      "Pungsan Dog",
      "Pyrenean Mastiff",
      "Pyrenean Shepherd",
      "Rafeiro do Alentejo",
      "Rajapalayam",
      "Rampur Greyhound",
      "Rastreador Brasileiro",
      "Rat Terrier",
      "Ratonero Bodeguero Andaluz",
      "Redbone Coonhound",
      "Rhodesian Ridgeback",
      "Rottweiler",
      "Rough Collie",
      "Russell Terrier",
      "Russian Spaniel",
      "Russian tracker",
      "Russo-European Laika",
      "Sabueso Español",
      "Saint-Usuge Spaniel",
      "Sakhalin Husky",
      "Saluki",
      "Samoyed",
      "Sapsali",
      "Schapendoes",
      "Schillerstövare",
      "Schipperke",
      "Schweizer Laufhund",
      "Schweizerischer Niederlaufhund",
      "Scotch Collie",
      "Scottish Deerhound",
      "Scottish Terrier",
      "Sealyham Terrier",
      "Segugio Italiano",
      "Seppala Siberian Sleddog",
      "Serbian Hound",
      "Serbian Tricolour Hound",
      "Shar Pei",
      "Shetland Sheepdog",
      "Shiba Inu",
      "Shih Tzu",
      "Shikoku",
      "Shiloh Shepherd Dog",
      "Siberian Husky",
      "Silken Windhound",
      "Sinhala Hound",
      "Skye Terrier",
      "Sloughi",
      "Slovak Cuvac",
      "Slovakian Rough-haired Pointer",
      "Small Greek Domestic Dog",
      "Small Münsterländer",
      "Smooth Collie",
      "South Russian Ovcharka",
      "Southern Hound",
      "Spanish Mastiff",
      "Spanish Water Dog",
      "Spinone Italiano",
      "Sporting Lucas Terrier",
      "St. Bernard",
      "St. John's water dog",
      "Stabyhoun",
      "Staffordshire Bull Terrier",
      "Standard Schnauzer",
      "Stephens Cur",
      "Styrian Coarse-haired Hound",
      "Sussex Spaniel",
      "Swedish Lapphund",
      "Swedish Vallhund",
      "Tahltan Bear Dog",
      "Taigan",
      "Talbot",
      "Tamaskan Dog",
      "Teddy Roosevelt Terrier",
      "Telomian",
      "Tenterfield Terrier",
      "Thai Bangkaew Dog",
      "Thai Ridgeback",
      "Tibetan Mastiff",
      "Tibetan Spaniel",
      "Tibetan Terrier",
      "Tornjak",
      "Tosa",
      "Toy Bulldog",
      "Toy Fox Terrier",
      "Toy Manchester Terrier",
      "Toy Trawler Spaniel",
      "Transylvanian Hound",
      "Treeing Cur",
      "Treeing Walker Coonhound",
      "Trigg Hound",
      "Tweed Water Spaniel",
      "Tyrolean Hound",
      "Vizsla",
      "Volpino Italiano",
      "Weimaraner",
      "Welsh Sheepdog",
      "Welsh Springer Spaniel",
      "Welsh Terrier",
      "West Highland White Terrier",
      "West Siberian Laika",
      "Westphalian Dachsbracke",
      "Wetterhoun",
      "Whippet",
      "White Shepherd",
      "Wire Fox Terrier",
      "Wirehaired Pointing Griffon",
      "Wirehaired Vizsla",
      "Yorkshire Terrier",
      "Sarplaninac"
    ]
    return dogbreeds;
  }
  getCatBreeds() {
    var catsbreeds = [
      "Abyssinian",
      "Aegean",
      "American Curl",
      "American Bobtail",
      "American Shorthair",
      "American Wirehair",
      "Arabian Mau",
      "Australian Mist",
      "Asian",
      "Asian Semi-longhair",
      "Balinese",
      "Bambino",
      "Bengal",
      "Birman",
      "Bombay",
      "Brazilian Shorthair",
      "British Semi-longhair",
      "British Shorthair",
      "British Longhair",
      "Burmese",
      "Burmilla",
      "California Spangled",
      "Chantilly-Tiffany",
      "Chartreux",
      "Chausie",
      "Cheetoh",
      "Colorpoint Shorthair",
      "Cornish Rex",
      "Cymric",
      "Cyprus",
      "Devon Rex",
      "Donskoy",
      "Dragon Li",
      "Dwarf cat",
      "Egyptian Mau",
      "European Shorthair",
      "Exotic Shorthair",
      "Foldex",
      "German Rex",
      "Havana Brown",
      "Highlander",
      "Himalayan",
      "Japanese Bobtail",
      "Javanese",
      "Karelian Bobtail",
      "Khao Manee",
      "Korat",
      "Korean Bobtail",
      "Korn Ja",
      "Kurilian Bobtail",
      "LaPerm",
      "Lykoi",
      "Maine Coon",
      "Manx",
      "Mekong Bobtail",
      "Minskin",
      "Munchkin",
      "Nebelung",
      "Napoleon",
      "Norwegian Forest cat",
      "Ocicat",
      "Ojos Azules",
      "Oregon Rex",
      "Oriental Bicolor",
      "Oriental Shorthair",
      "Oriental Longhair",
      "PerFold",
      "Persian (Modern Persian Cat)",
      "Persian (Traditional Persian Cat)",
      "Peterbald",
      "Pixie-bob",
      "Raas",
      "Ragamuffin",
      "Ragdoll",
      "Russian Blue",
      "Russian White, Black and Tabby",
      "Sam Sawet",
      "Savannah",
      "Scottish Fold",
      "Selkirk Rex",
      "Serengeti",
      "Serrade petit",
      "Siamese",
      "Siberian",
      "Singapura",
      "Snowshoe",
      "Sokoke",
      "Somali",
      "Sphynx",
      "Suphalak",
      "Thai",
      "Thai Lilac",
      "Tonkinese",
      "Toyger",
      "Turkish Angora",
      "Turkish Van",
      "Ukrainian Levkoy"
    ]
    return catsbreeds;
  }
  getGoatBreeds() {
    let Goat = [
      "Abaza",
      "Abergelle",
      "Adamello blond",
      "Afar",
      "Agew",
      "Agrupación de las Mesetas",
      "Albatinah",
      "Algarvia",
      "Aljabal Alakhdar",
      "Alpine",
      "Altai Mountain",
      "Andaman local",
      "Anglo-Nubian",
      "Angora",
      "Appenzell Goat",
      "Aradi",
      "Arapawa",
      "Argentata dell'Etna",
      "Arsi-Bale",
      "Asmari",
      "Aspromonte",
      "Assam Hill",
      "Aswad",
      "Attappady black",
      "Attaouia",
      "Auckland Island",
      "Australian brown",
      "Australian Cashmere",
      "Australian Heritage Angora",
      "Australian Melaan",
      "Australian Miniature Goat",
      "Azpi Gorri",
      "Azul",
      "Bagot",
      "Banatian White",
      "Barbari",
      "Beetal",
      "Belgian Fawn",
      "Benadir",
      "Bhuj",
      "Bilberry",
      "Bionda dell'Adamello",
      "Black Bengal",
      "Boer",
      "Booted",
      "British Alpine",
      "Brown Shorthair",
      "Canary Island",
      "Canindé",
      "Carpathian",
      "Chyangra",
      "Chamba",
      "Chamois Coloured goat",
      "Changthangi",
      "Chappar",
      "Charnequeira",
      "Chengde Polled",
      "Chengdu Brown",
      "Chigu",
      "Chué",
      "Corsican",
      "Dera Din Panah",
      "Damani",
      "Damascus",
      "Danish Landrace",
      "Don",
      "Duan",
      "Dutch Landrace",
      "Dutch Toggenburg",
      "Erzgebirge",
      "Fainting",
      "Frisa Valtellinese",
      "Finnish Landrace",
      "Garganica",
      "Girgentana",
      "Göingeget",
      "Golden Guernsey",
      "Grisons Striped",
      "Guddi",
      "Hailun",
      "Haimen",
      "Hasi",
      "Hejazi",
      "Hexi Cashmere",
      "Hongtong",
      "Huaipi",
      "Huaitoutala",
      "Hungarian Improved",
      "Icelandic",
      "Irish",
      "Jamnapari",
      "Jining Grey",
      "Jonica",
      "Kaghani",
      "Kalahari Red",
      "Kalbian",
      "Kamori",
      "Kinder",
      "Kiko",
      "Korean Black Goat",
      "Kri-kri",
      "La Mancha",
      "Laoshan",
      "Majorera",
      "Malabari goat",
      "Maltese",
      "Massif Central",
      "Markhoz",
      "Messinese",
      "Mini Oberhasli",
      "Mountain Goat",
      "Murcia-Granada",
      "Murciana",
      "Nachi",
      "Nigerian Dwarf",
      "Nigora goat",
      "Nera Verzasca",
      "Norwegian",
      "Oberhasli",
      "Orobica",
      "Peacock",
      "Pinzgauer",
      "Philippine",
      "Poitou",
      "Pridonskaya",
      "Pygmy",
      "Pygora",
      "Pyrenean",
      "Qinshan",
      "Red Boer",
      "Red Mediterranean",
      "Repartida",
      "Rove",
      "Russian White",
      "Saanen",
      "Sable Saanen",
      "Valdostana",
      "Sahelian",
      "San Clemente Island",
      "Sarda",
      "Short-eared Somali",
      "Sirohi",
      "Swedish Landrace",
      "Somali",
      "Spanish",
      "Stiefelgeiss",
      "Surati",
      "Syrian Mountain goat (Syrian Jabali goat)",
      "Tauernsheck",
      "Thuringian",
      "Toggenburg",
      "Uzbek Black",
      "Valais Blackneck",
      "Vatani",
      "Verata",
      "West African Dwarf",
      "White Shorthaired",
      "Xinjiang",
      "Xuhai",
      "Yemen Mountain",
      "Zalawadi",
      "Zhiwulin Black",
      "Zhongwei"

    ]
    return Goat;
  }
  getSheepBreeds() {
    let Sheep = [
      "Acipayam",
      "Adal",
      "Afghan Arabi",
      "Africana",
      "Alai",
      "Alcarrena",
      "Algarvechurro",
      "Algerian Arab",
      "Altai",
      "Altay",
      "American Blackbelly",
      "Apennine",
      "Arabi",
      "Arapawa Island",
      "Awassi",
      "Balkhi",
      "Baluchi",
      "Balwen Welsh Mountain",
      "Barbados Blackbelly",
      "Bavarian Forest",
      "Bentheimer Landschaf",
      "Bergamasca",
      "Beulah Speckled-Face",
      "Bibrik",
      "Biellese",
      "Blackhead Persian",
      "Black Welsh Mountain Sheep",
      "Bleu du Maine",
      "Bluefaced Leicester",
      "Bond",
      "Booroola Merino",
      "Border Leicester",
      "Boreray",
      "Bovska",
      "Braunes Bergschaf",
      "Brazilian Somali",
      "Brecknock Hill Cheviot",
      "British Milk Sheep",
      "Brillenschaf",
      "Bündner Oberland",
      "California Red",
      "California Variegated Mutant",
      "Campanian Barbary",
      "Castlemilk Moorit",
      "Charollais",
      "Cheviot",
      "Chios",
      "Cholistani",
      "Clun Forest",
      "Coburger Fuchsschaf",
      "Columbia",
      "Comeback",
      "Comisana",
      "Coopworth",
      "Cormo",
      "Corriedale",
      "Cotswold",
      "Criollo",
      "Dala",
      "Damani",
      "Damara",
      "Danish Landrace",
      "Dartmoor",
      "Debouillet",
      "Delaine Merino",
      "Dorper",
      "Derbyshire Gritstone",
      "Devon Closewool",
      "Deutsches Blaukoepfiges Fleischschaf",
      "Dorset",
      "Dorset Down",
      "Drysdale",
      "Elliottdale",
      "Exmoor Horn",
      "Fabrianese",
      "Faeroes",
      "Finnsheep",
      "Fonthill Merino",
      "Friesian Milk Sheep",
      "Galway",
      "Gansu Alpine Fine-wool",
      "Gentile di Puglia",
      "German Blackheaded Mutton",
      "German Mountain",
      "German Mutton Merino",
      "German Whiteheaded Mutton",
      "Gotland Sheep",
      "Graue Gehoernte Heidschnucke",
      "Gromark",
      "Gulf Coast Native",
      "Gute",
      "Hampshire",
      "Han",
      "Harnai",
      "Hasht Nagri",
      "Hazaragie",
      "Hebridean",
      "Herdwick",
      "Hill Radnor",
      "Hog Island Sheep",
      "Hu",
      "Icelandic",
      "Ile-de-France",
      "Istrian Pramenka",
      "Jacob",
      "Jezersko-Solcava",
      "Kachhi",
      "Kajli",
      "Karakul",
      "Katahdin",
      "Kerry Hill",
      "Kooka",
      "Langhe",
      "Lati",
      "Leicester Longwool",
      "Leineschaf",
      "Lincoln",
      "Llanwenog",
      "Lleyn",
      "Lohi",
      "Lonk",
      "Luzein",
      "Manx Loaghtan",
      "Masai",
      "Massese",
      "Medium-Wool Merino",
      "Mehraban",
      "Merinolandschaf",
      "Moghani",
      "Montadale",
      "Morada Nova",
      "mouflon",
      "Navajo-Churro",
      "Norfolk Horn",
      "North Country Cheviot",
      "Norwegian Fur",
      "Old Norwegian",
      "Orkney",
      "Ossimi",
      "Oxford",
      "Pagliarola",
      "Pelibüey",
      "Perendale",
      "Pinzirita",
      "Pitt Island",
      "Poll Merino",
      "Polwarth",
      "Polypay",
      "Pomeranian Coarsewool",
      "Portland",
      "Priangan",
      "Rabo Largo",
      "Racka",
      "Rambouillet",
      "Rasa Aragonesa",
      "Red Engadine",
      "Rhoenschaf",
      "Rideau Arcott",
      "Romanov",
      "Romney",
      "Rouge de l'Quest",
      "Rough Fell",
      "Royal White",
      "Rya",
      "Ryeland",
      "Rygja",
      "Sahel-type",
      "Santa Cruz",
      "Santa Inês",
      "Sardinian",
      "Sar Planina",
      "Scottish Blackface",
      "Sicilian Barbary",
      "Shetland",
      "Shropshire",
      "Skudde",
      "Soay",
      "Somali",
      "Sopravissana",
      "South African Merino",
      "South African Mutton Merino",
      "South Suffolk",
      "Southdown",
      "South Wales Mountain",
      "Spælsau",
      "Spiegel",
      "St. Croix (Virgin Island White)",
      "Steigar",
      "Steinschaf",
      "Strong Wool Merino",
      "Suffolk",
      "Sumavska",
      "Swaledale",
      "Swedish Fur Sheep",
      "Targhee",
      "Teeswater",
      "Texel",
      "Thalli",
      "Tong",
      "Touabire",
      "Tsurcana",
      "Tunis",
      "Tyrol Mountain",
      "Uda",
      "Ujumqin",
      "Ushant",
      "Valachian Sheep",
      "Valachian Improved Sheep",
      "Valais Blacknose",
      "Van Rooy",
      "Vendéen",
      "Wiltipoll",
      "Walachenschaf",
      "Wallis Country Sheep",
      "Waziri",
      "Weisse Hornlose Heidschnucke",
      "Welsh Hill Speckled Face",
      "Welsh Mountain",
      "Welsh Mountain Badger Faced",
      "Wensleydale",
      "West African Dwarf",
      "White Karaman",
      "White Horned Heath",
      "White Suffolk",
      "Whiteface Dartmoor",
      "Whiteface Woodland",
      "White Maritza sheep",
      "Wiltshire Horn",
      "Xalda",
      "Xaxi Ardia",
      "Xinjiang Finewool",
      "Yankasa",
      "Yemeni",
      "Yemen White",
      "Yiecheng",
      "Yoroo",
      "Yunnan Semifinewool",
      "Zackel",
      "Zaghawa",
      "Zaian",
      "Zaïre Long-Legged",
      "Zakynthos",
      "Zeeland Milk",
      "Zel",
      "Zelazna",
      "Zemmour",
      "Zeta Yellow",
      "Zlatusha",
      "Zoulay",
      "Zwartbles",
      "Zulu"
    ]
    return Sheep;
  }
  getCowBreeds() {
    let Cow = [
      "Rath",
      "Vestland Fjord",
      "Africander",
      "Akaushi",
      "Alberes",
      "Alentejana",
      "Allmogekor",
      "American Braford",
      "American White Park",
      "Amerifax",
      "Amrit Mahal",
      "Anatolian Black",
      "Andalusian Black",
      "Andalusian Grey",
      "Angeln",
      "Angus",
      "Ankole",
      "Ankole-Watusi",
      "Argentine Criollo",
      "Asturian Mountain",
      "Asturian Valley",
      "Aubrac",
      "Aulie-Ata",
      "Australian Braford",
      "Australian Friesian Sahiwal",
      "Australian Lowline",
      "Australian Milking Zebu",
      "Ayrshire",
      "Azaouak - NW Niger",
      "Bachaur",
      "Baladi",
      "Baltata Romaneasca",
      "Barka",
      "Barzona",
      "Bazadais",
      "Béarnais",
      "Beefalo",
      "Beefmaker",
      "Belarus Red",
      "Belgian Blue",
      "Belgian Red",
      "Belmont Adaptaur",
      "Belmont Red",
      "Belted Galloway",
      "Bengali",
      "Berrendas",
      "Bhagnari",
      "Blacksided Trondheim and Norland",
      "Blanca Cacereña/White Cáceres",
      "Blanco Orejinegro",
      "Blonde d'Aquitaine",
      "Boran",
      "Bordelais",
      "Brahman",
      "Brahmousin",
      "Brangus",
      "Braunvieh",
      "British White",
      "Brown Swiss",
      "Busa",
      "Cachena",
      "Canadian Highland",
      "Canadienne",
      "Canary Island",
      "Canchim",
      "Carinthian Blond",
      "Caucasian",
      "Channi",
      "Charbray",
      "Charolais",
      "Chianina",
      "Chinampo",
      "Chinese Black-and-White",
      "Cholistani",
      "Corriente",
      "Costeño con Cuernos",
      "Dajal",
      "Damascus",
      "Damietta",
      "Dangi",
      "Danish Jersey",
      "Danish Red",
      "Deoni",
      "Devon",
      "Dexter",
      "Dhanni",
      "Dølafe",
      "Droughtmaster",
      "Dulong",
      "Dutch Belted (Lakenvelder)",
      "Dutch Friesian",
      "East Anatolian Red",
      "Enderby Island",
      "English Longhorn",
      "Estonian Red",
      "Evolène",
      "Fighting",
      "Finnish",
      "Fjall",
      "Florida Cracker",
      "Galician Blond",
      "Galloway",
      "Gaolao",
      "Gascon",
      "Gelbvieh",
      "German Angus Moiled",
      "German Red Pied",
      "Gir",
      "Glan",
      "Gloucester",
      "Gobra",
      "Greek Shorthorn",
      "Greek Steppe",
      "Groningen",
      "Guernsey",
      "Guzerat",
      "Hallikar",
      "Hariana",
      "Harton",
      "Hays Converter",
      "Hereford",
      "Herens",
      "Highland",
      "Hinterwald",
      "Holando-Argentino",
      "Holstein",
      "Horro",
      "Hungarian Grey",
      "Icelandic",
      "Illawarra",
      "Indo-Brazilian",
      "Irish Moiled",
      "Israeli Holstein",
      "Israeli Red",
      "Istoben",
      "Jamaica Black",
      "Jamaica Hope",
      "Jamaica Red",
      "Jaulan",
      "Jersey",
      "Kangayam",
      "Kankrej",
      "Karan Fries",
      "Karan Swiss",
      "Kazakh",
      "Kenwariya",
      "Kerry",
      "Kherigarh",
      "Khillari",
      "Kholmogory",
      "Kilis",
      "Krishna Valley",
      "Kurdi Black",
      "Kuri",
      "Latvian Brown (Buraya latviiskaya)",
      "Limousin",
      "Limpurger",
      "Lincoln Red",
      "Lithuanian Red",
      "Lohani",
      "Lourdais",
      "Luing",
      "Madagascar Zebu",
      "Maine-Anjou",
      "Malvi",
      "Mandalong",
      "Marchigiana",
      "Maremmana",
      "Masai",
      "Mashona",
      "Maure",
      "Mazandarani",
      "Meuse-Rhine-Yssel",
      "Mewati",
      "Milking Devon",
      "Milking Shorthorn",
      "Modicana",
      "Montbéliard",
      "Morucha",
      "Murboden",
      "Murray Grey",
      "Muturu - West African Dwarf Shorthorn",
      "N'dama",
      "Nagori",
      "Nanyang",
      "Nelore",
      "Nimari",
      "Normande",
      "Norwegian Red",
      "Ongole",
      "Oropa",
      "Ovambo",
      "Parthenais",
      "Philippine Native",
      "Piedmontese",
      "Pinzgauer",
      "Polish Red",
      "Polled Hereford",
      "Ponwar",
      "Qinchuan",
      "Rathi",
      "Rätien Gray",
      "Red Angus",
      "Red Brangus",
      "Red Fulani or Mbororo",
      "Red Pied Friesian",
      "Red Poll",
      "Red Polled Østland",
      "Red Sindhi",
      "Red Steppe",
      "Reggiana",
      "Retinta",
      "Rojhan",
      "Romagnola",
      "Romosinuano",
      "Russian Black Pied",
      "RX3",
      "Sahiwal",
      "Salers",
      "Salorn",
      "San Martinero",
      "Sanhe",
      "Santa Cruz",
      "Santa Gertrudis",
      "Sarabi",
      "Senepol",
      "Shetland",
      "Shorthorn",
      "Siboney",
      "Simbrah",
      "Simmental",
      "Siri",
      "Slovenian Cika",
      "South Devon",
      "Sudanese Fulani",
      "Sussex",
      "Swedish Friesian",
      "Swedish Red Polled",
      "Swedish Red-and-White",
      "Tarentaise",
      "Telemark",
      "Texas Longhorn",
      "Texon",
      "Tharparkar",
      "Tswana",
      "Turkish Grey Steppe",
      "Ukrainian",
      "Ukrainian Grey",
      "Ukrainian Whitehead",
      "Umblachery",
      "Ural Black Pied",
      "Vestland Red Polled",
      "Vosges",
      "Waygu",
      "Welsh Black",
      "White Park",
      "Yanbian",
      " Chinese Mongolian",
      "Chinese Xinjiang Brown",
      "Gelbray"
    ]
    return Cow;
  }
  getBuffaloBreeds() {
    let Buffalo = [
      "Anatolian buffalo",
      "Assam",
      "Australian buffalo",
      "Azari",
      "Azi Kheli",
      "Badavan",
      "Baio",
      "Baladi",
      "Balkan",
      "Bama kwye",
      "Bangladeshi",
      "Banni",
      "Beheri",
      "Belang",
      "Bhadawari",
      "Bhainsi",
      "Bhavanegri",
      "Binhu",
      "Borneo buffalo",
      "Brazilian",
      "Brazilian Carabao",
      "Búfalo de Pantano",
      "Búfalo de Rio",
      "Buffalypso",
      "Bulgarian buffalo",
      "Bulgarian Murrah",
      "Burmese",
      "Burmese wild buffalo",
      "Cambodian buffalo",
      "Carabao",
      "Caucasian",
      "Chilika",
      "Chinese buffalo",
      "Domaci bivo",
      "Dongliu",
      "Egyptian",
      "Enshi Mountainous",
      "Fu'an",
      "Fuling",
      "Fuzhong",
      "Gaddi",
      "Georgian buffalo",
      "Ghab",
      "Gilani",
      "Godavari",
      "Greek buffalo",
      "Guizhou",
      "Guizhou White",
      "Haizi",
      "Iranian and Iraqi",
      "Iranian",
      "Indonesian wild buffalo",
      "Iranian Azari ecotype",
      "Iraqi",
      "Italian",
      "Jafarabadi",
      "Jerangi",
      "Jianghan",
      "Kalaban",
      "Kalahandi",
      "Kalang",
      "Kebo",
      "Kerbau-Gunung",
      "Kerbau-Indonesia",
      "Kerbau Moa",
      "Kerbau-Murrah",
      "Kerbau-Sumatra-Barat",
      "Kerbau-Sumatra-Utara",
      "Kerbau-Sumbawa",
      "Khoozestani",
      "Kundi",
      "Lanka",
      "Lime",
      "Mahish",
      "Malaysian",
      "Manda",
      "Mannar",
      "Marathwada",
      "Masri",
      "Mediterranean",
      "Mehsana",
      "Mestizo",
      "Minufi",
      "Monouli",
      "Mountain buffalo",
      "Munding",
      "Murrah",
      "Myanmar swamp buffalo",
      "Nagpuri",
      "Nelore",
      "Nepalese hill buffalo",
      "Nepalese mountain buffalo",
      "Ngo",
      "Nili",
      "NiliRavi",
      "Pa Sauk",
      "Pahadi",
      "Palitana",
      "Pampangan",
      "Panch Kalyani",
      "Pandharpuri",
      "Papua New Guinea buffalo",
      "Parkote",
      "Parlakimedi",
      "Peddakimedi",
      "Philippine",
      "Plain buffalo",
      "Purnathadi",
      "Purvi",
      "Ravi",
      "Rawa",
      "Romanian buffalo",
      "Rosilho",
      "Siamese buffalo",
      "Saidi",
      "Sambalpur",
      "Sapi Tenusu",
      "Sawah",
      "Shanghai",
      "Shan Kywe",
      "Shannan",
      "Southeast Yunnan",
      "South Kanara",
      "Surti",
      "Taiwan buffalo",
      "Tamankaduwa",
      "Tamarao",
      "Tarai buffalo",
      "Tedong",
      "Tipo Baio",
      "Toda",
      "Toraya",
      "Trau Noi",
      "Trinitario",
      "Wenzhou",
      "Xiajiang",
      "Xilin",
      "Xinfeng Mountainous",
      "Xinglong",
      "Xingyang",
      "Yanjin",
      "Yibin"
    ]
    return Buffalo;
  }
  getHenBreeds() {
    let Hen = [
      "Araucana",
      "Ameraucana",
      "Cream Legbar",
      "Easter Egger",
      "Isbar",
      "Olive Egger",
      "Whiting True Blue",
      "Flowery Hen",
      "Ancona",
      "Andalusian",
      "Brakel",
      "Cinnamon Queen",
      "Friesan",
      "Gournay",
      "Hamburg",
      "Holland",
      "Leghorn",
      "Minorca",
      "Australorp",
      "Barnvelder",
      "Bielefelder",
      "Black Star",
      "Red Star",
      "Brahma",
      "Buckeye",
      "Delaware",
      "Chantecler",
      "Jersey Giant",
      "Java",
      "Naked Neck",
      "Maran",
      "Plymouth Rock",
      "Orpington",
      "Speckledy aka Speckled Ranger",
      "Rhode Island Red",
      "Welsummer",
      "Sussex",
      "Wyandotte",
      "Appenzeller",
      "Brabanter",
      "Crevecoeur",
      "Houdan",
      "Polish",
      "Sultan",
      "Barbu D’uccle",
      "Belgian Antwerp D’anvers",
      "Booted Bantam",
      "Chabo",
      "Dutch Bantam",
      "Nankin",
      "Pekin Bantam",
      "Scots Dumpy",
      "Rosecomb Bantam",
      "Serama",
      "Sebright",
      "Altsteirer",
      "Brussbar",
      "California Grey",
      "Catalana",
      "Deathlayer",
      "Dampierre",
      "Dorking",
      "Iowa Blue",
      "Langshan",
      "Norwegian Jaehorn",
      "Marsh Daisy",
      "Orust",
      "Orloff",
      "Penedesenca",
      "Pavlovskaya",
      "Rhodebar",
      "Pita Pinta Asturiana",
      "Thuringian",
      "Twentse",
      "Ayam Cemani",
      "Campine",
      "Cubalaya",
      "Egyptian Fayoumi",
      "Favorelles",
      "La Fleche",
      "Lakenvelder",
      "Onagadori",
      "Phoenix",
      "Shamo",
      "Sicilian Buttercup",
      "Sumatra",
      "Swedish Black Hen",
      "Swedish Flower Hen (Blommehöna)",
      "White Faced Black Spanish",
      "Yokohama",
      "Barbezieux",
      "Basque Chicken",
      "Bresse",
      "Cornish",
      "Gallina di Saluzzo",
      "Ixworth",
      "New Hampshire",
      "RedCap",
      "Norfolk Grey",
      "Vorwerk",
      "Red Shaver",
      "Cochin",
      "Frizzle",
      "Malay",
      "Old English Game",
      "Silkie"
    ]
    return Hen
  }
  getParrotBreeds() {
    let Parrot = [
      "African Grey Parrot",
      "Australian King Parrot",
      "Blue and Yellow Macaw",
      "Blue Crowned Parakeet",
      "Blue Crowned Racquet Tail",
      "Blue Headed Parrot",
      "Blue Naped Parrot",
      "Blue Rumped Parrot",
      "Blue Winged Macaw",
      "Blue Winged Parrotlet",
      "Bluebonnet",
      "Budgerigar",
      "Burrowing Parakeet",
      "Cockatiel",
      "Crimson Rosella",
      "Cuban Amazon",
      "Double Eyed Fig Parrot",
      "Eclectus Parrot",
      "Galah",
      "Gang Gang Cockatoo",
      "Greater Vasa Parrot",
      "Grey Headed Lovebird",
      "Hyacinth Macaw",
      "Kakapo",
      "Kea",
      "Little Corella",
      "Monk Parakeet",
      "Mulga Parrot",
      "Musk Lorikeet",
      "Palm Cockatoo",
      "Papuan Lorikeet",
      "Peach Faced Parakeet",
      "Plum Headed Parakeet",
      "Rainbow Lorikeet",
      "Red and Blue Macaw",
      "Red Capped Parrot",
      "Red Crowned Parakeet",
      "Red Fan Parrot",
      "Red Lory",
      "Red Rumped Parrot",
      "Red Shouldered Macaw",
      "Red Tailed Black Cockatoo",
      "Red Winged Parrot",
      "Reddish Bellied Parakeet",
      "Regent Parrot",
      "Rock Parrot",
      "Rose Ringed Parakeet",
      "Rosy Faced Lovebird",
      "Ruppell’s Parrot",
      "Sapphire Rumped Parrotlet",
      "Scarlet Macaw",
      "Spix’s Macaw",
      "Sulphur Crested Cockatoo",
      "Superb Parrot",
      "Turquoise Fronted Amazon",
      "Varied Lorikeet",
      "Vernal Hanging Parrot",
      "Vulturine Parrot",
      "Yellow Chevroned Parakeet",
      "Yellow Crowned Parrot"
    ]
    return Parrot;
  }
  getHorseBreeds() {
    var horseBreeds = [
      "American Albino",
      "Abaco Barb",
      "Abtenauer",
      "Abyssinian",
      "Aegidienberger",
      "Akhal-Teke",
      "Albanian Horse",
      "Altai Horse",
      "Altèr Real",
      "American Cream Draft",
      "American Indian Horse",
      "American Paint Horse",
      "American Quarter Horse",
      "American Saddlebred",
      "American Warmblood",
      "Andalusian Horse",
      "Andravida Horse",
      "Anglo-Arabian",
      "Anglo-Arabo-Sardo",
      "Anglo-Kabarda",
      "Appaloosa",
      "AraAppaloosa",
      "Arabian Horse",
      "Ardennes Horse",
      "Arenberg-Nordkirchen",
      "Argentine Criollo",
      "Asian wild Horse",
      "Assateague Horse",
      "Asturcón",
      "Augeron",
      "Australian Brumby",
      "Australian Draught Horse",
      "Australian Stock Horse",
      "Austrian Warmblood",
      "Auvergne Horse",
      "Auxois",
      "Azerbaijan Horse",
      "Azteca Horse",
      "Baise Horse",
      "Bale",
      "Balearic Horse",
      "Balikun Horse",
      "Baluchi Horse",
      "Banker Horse",
      "Barb Horse",
      "Bardigiano",
      "Bashkir Curly",
      "Basque Mountain Horse",
      "Bavarian Warmblood",
      "Belgian Half-blood",
      "Belgian Horse",
      "Belgian Warmblood ",
      "Bhutia Horse",
      "Black Forest Horse",
      "Blazer Horse",
      "Boerperd",
      "Borana",
      "Boulonnais Horse",
      "Brabant",
      "Brandenburger",
      "Brazilian Sport Horse",
      "Breton Horse",
      "Brumby",
      "Budyonny Horse",
      "Burguete Horse",
      "Burmese Horse",
      "Byelorussian Harness Horse",
      "Calabrese Horse",
      "Camargue Horse",
      "Camarillo White Horse",
      "Campeiro",
      "Campolina",
      "Canadian Horse",
      "Canadian Pacer",
      "Carolina Marsh Tacky",
      "Carthusian Horse",
      "Caspian Horse",
      "Castilian Horse",
      "Castillonnais",
      "Catria Horse",
      "Cavallo Romano della Maremma Laziale",
      "Cerbat Mustang",
      "Chickasaw Horse",
      "Chilean Corralero",
      "Choctaw Horse",
      "Cleveland Bay",
      "Clydesdale Horse",
      "Cob",
      "Coldblood Trotter",
      "Colonial Spanish Horse",
      "Colorado Ranger",
      "Comtois Horse",
      "Corsican Horse",
      "Costa Rican Saddle Horse",
      "Cretan Horse",
      "Criollo Horse",
      "Croatian Coldblood",
      "Cuban Criollo",
      "Cumberland Island Horse",
      "Curly Horse",
      "Czech Warmblood",
      "Daliboz",
      "Danish Warmblood",
      "Danube Delta Horse",
      "Dole Gudbrandsdal",
      "Don",
      "Dongola Horse",
      "Draft Trotter",
      "Dutch Harness Horse",
      "Dutch Heavy Draft",
      "Dutch Warmblood",
      "Dzungarian Horse",
      "East Bulgarian",
      "East Friesian Horse",
      "Estonian Draft",
      "Estonian Horse",
      "Falabella",
      "Faroese",
      "Finnhorse",
      "Fjord Horse",
      "Fleuve",
      "Florida Cracker Horse",
      "Foutanké",
      "Frederiksborg Horse",
      "Freiberger",
      "French Trotter",
      "Friesian Cross",
      "Friesian Horse",
      "Friesian Sporthorse",
      "Furioso-North Star",
      "Galiceño",
      "Galician Pony",
      "Gelderland Horse",
      "Georgian Grande Horse",
      "German Warmblood",
      "Giara Horse",
      "Gidran",
      "Groningen Horse",
      "Gypsy Horse",
      "Hackney Horse",
      "Haflinger",
      "Hanoverian Horse",
      "Heck Horse",
      "Heihe Horse",
      "Henson Horse",
      "Hequ Horse",
      "Hirzai",
      "Hispano-Bretón",
      "Holsteiner Horse",
      "Horro",
      "Hungarian Warmblood",
      "Icelandic Horse",
      "Iomud",
      "Irish Draught",
      "Irish Sport Horse sometimes called Irish Hunter",
      "Italian Heavy Draft",
      "Italian Trotter",
      "Jaca Navarra",
      "Jeju Horse",
      "Jutland Horse",
      "Kabarda Horse",
      "Kafa",
      "Kaimanawa Horses",
      "Kalmyk Horse",
      "Karabair",
      "Karabakh Horse",
      "Karachai Horse",
      "Karossier",
      "Kathiawari",
      "Kazakh Horse",
      "Kentucky Mountain Saddle Horse",
      "Kiger Mustang",
      "Kinsky Horse",
      "Kisber Felver",
      "Kiso Horse",
      "Kladruber",
      "Knabstrupper",
      "Konik",
      "Kundudo",
      "Kustanair",
      "Kyrgyz Horse",
      "Latvian Horse",
      "Lipizzan",
      "Lithuanian Heavy Draught",
      "Lokai",
      "Losino Horse",
      "Lusitano",
      "Lyngshest",
      "M'Bayar",
      "M'Par",
      "Mallorquín",
      "Malopolski",
      "Mangalarga",
      "Mangalarga Marchador",
      "Maremmano",
      "Marismeño Horse",
      "Marsh Tacky",
      "Marwari Horse",
      "Mecklenburger",
      "Međimurje Horse",
      "Menorquín",
      "Mérens Horse",
      "Messara Horse",
      "Metis Trotter",
      "Mezőhegyesi Sport Horse",
      "Miniature Horse",
      "Misaki Horse",
      "Missouri Fox Trotter",
      "Monchina",
      "Mongolian Horse",
      "Mongolian Wild Horse",
      "Monterufolino",
      "Morab",
      "Morgan Horse",
      "Mountain Pleasure Horse",
      "Moyle Horse",
      "Murakoz Horse",
      "Murgese",
      "Mustang Horse",
      "Namib Desert Horse",
      "Nangchen Horse",
      "National Show Horse",
      "Nez Perce Horse",
      "Nivernais Horse",
      "Nokota Horse",
      "Noma",
      "Nonius Horse",
      "Nooitgedachter",
      "Nordlandshest",
      "Noriker Horse",
      "Norman Cob",
      "North American Single-Footer Horse",
      "North Swedish Horse",
      "Norwegian Coldblood Trotter",
      "Norwegian Fjord",
      "Novokirghiz",
      "Oberlander Horse",
      "Ogaden",
      "Oldenburg Horse",
      "Orlov trotter",
      "Ostfriesen",
      "Paint",
      "Pampa Horse",
      "Paso Fino",
      "Pentro Horse",
      "Percheron",
      "Persano Horse",
      "Peruvian Paso",
      "Pintabian",
      "Pleven Horse",
      "Poitevin Horse",
      "Posavac Horse",
      "Pottok",
      "Pryor Mountain Mustang",
      "Przewalski's Horse",
      "Pura Raza Española",
      "Purosangue Orientale",
      "Qatgani",
      "Quarab",
      "Quarter Horse",
      "Racking Horse",
      "Retuerta Horse",
      "Rhenish German Coldblood",
      "Rhinelander Horse",
      "Riwoche Horse",
      "Rocky Mountain Horse",
      "Romanian Sporthorse",
      "Rottaler",
      "Russian Don",
      "Russian Heavy Draft",
      "Russian Trotter",
      "Saddlebred",
      "Salerno Horse",
      "Samolaco Horse",
      "San Fratello Horse",
      "Sarcidano Horse",
      "Sardinian Anglo-Arab",
      "Schleswig Coldblood",
      "Schwarzwälder Kaltblut",
      "Selale",
      "Sella Italiano",
      "Selle Français",
      "Shagya Arabian",
      "Shan Horse",
      "Shire Horse",
      "Siciliano Indigeno",
      "Silesian Horse",
      "Sokolsky Horse",
      "Sorraia",
      "South German Coldblood",
      "Soviet Heavy Draft",
      "Spanish Anglo-Arab",
      "Spanish Barb",
      "Spanish Jennet Horse",
      "Spanish Mustang",
      "Spanish Tarpan",
      "Spanish-Norman Horse",
      "Spiti Horse",
      "Spotted Saddle Horse",
      "Standardbred Horse",
      "Suffolk Punch",
      "Swedish Ardennes",
      "Swedish coldblood trotter",
      "Swedish Warmblood",
      "Swiss Warmblood",
      "Taishū Horse",
      "Takhi",
      "Tawleed",
      "Tchernomor",
      "Tennessee Walking Horse",
      "Tersk Horse",
      "Thoroughbred",
      "Tiger Horse",
      "Tinker Horse",
      "Tolfetano",
      "Tori Horse",
      "Trait Du Nord",
      "Trakehner",
      "Tsushima",
      "Tuigpaard",
      "Ukrainian Riding Horse",
      "Unmol Horse",
      "Uzunyayla",
      "Ventasso Horse",
      "Virginia Highlander",
      "Vlaamperd",
      "Vladimir Heavy Draft",
      "Vyatka",
      "Waler",
      "Waler Horse",
      "Walkaloosa",
      "Warlander",
      "Warmblood",
      "Welsh Cob",
      "Westphalian Horse",
      "Wielkopolski",
      "Württemberger",
      "Xilingol Horse",
      "Yakutian Horse",
      "Yili Horse",
      "Yonaguni Horse",
      "Zaniskari",
      "Žemaitukas",
      "Zhemaichu",
      "Zweibrücker"
    ]
    return horseBreeds
  }
}