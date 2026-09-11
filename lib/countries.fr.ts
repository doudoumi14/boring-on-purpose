import type { Country } from "./countries";

/**
 * French copy for each country, keyed by code. Kept beside the English rather
 * than interleaved with it so both read as continuous prose instead of a table
 * of fragments — translated finance copy goes wrong when it is assembled from
 * pieces. countries.test.ts fails if a country or a field goes missing here.
 *
 * `inCountry` carries the preposition, because French needs "au Canada" but
 * "en France" and a template cannot guess which.
 */
export type CountryFr = Pick<
  Country,
  | "name"
  | "accounts"
  | "fundGuidance"
  | "examples"
  | "pitfall"
  | "bondExamples"
  | "bondNote"
  | "statePension"
> & { inCountry: string };

export const countriesFr: Record<string, CountryFr> = {
  CA: {
    name: "Canada",
    inCountry: "au Canada",
    accounts: [
      { name: "Cotisation REER de l'employeur", note: "Si votre employeur verse une contribution équivalente, prenez-la en premier. Aucun placement ne bat ce rendement immédiat." },
      { name: "CELI", note: "La croissance et les retraits sont libres d'impôt. Souple, donc il convient à la plupart des gens avant le REER." },
      { name: "REER", note: "Déduction aujourd'hui, imposé au retrait. Surtout intéressant si vos revenus sont élevés maintenant et plus faibles à la retraite." },
      { name: "Compte non enregistré", note: "Seulement une fois les droits de cotisation ci-dessus utilisés." },
    ],
    fundGuidance:
      "Un seul FNB mondial tout-en-un coté au Canada, ou un fonds indiciel de marché total. Un seul fonds suffit vraiment.",
    examples: [
      { name: "Vanguard All-Equity ETF Portfolio", ticker: "VEQT", note: "Un seul fonds, uniquement des actions, le monde entier. Il se rééquilibre tout seul." },
      { name: "iShares Core Equity ETF Portfolio", ticker: "XEQT", note: "La même idée chez un autre fournisseur. L'un ou l'autre convient." },
      { name: "Vanguard Growth ETF Portfolio", ticker: "VGRO", note: "Environ 80 % actions et 20 % obligations, si vous préférez les obligations incluses." },
    ],
    pitfall:
      "Les fonds communs vendus par les banques prélèvent couramment 2 % par an ou plus, et c'est ce qu'on vous proposera si vous entrez en succursale. Un compte d'épargne à intérêt élevé n'est pas non plus un placement : sur trente ans, il perd contre l'inflation.",
    bondExamples: [
      { name: "Vanguard Canadian Aggregate Bond Index ETF", ticker: "VAB", note: "Un large éventail d'obligations d'État et d'entreprises canadiennes." },
      { name: "BMO Aggregate Bond Index ETF", ticker: "ZAG", note: "La même idée chez un autre fournisseur." },
      { name: "iShares Core Canadian Universe Bond Index ETF", ticker: "XBB", note: "Convient aussi. Ces trois-là sont presque identiques." },
    ],
    bondNote:
      "Si vous détenez un fonds tout-en-un comme VGRO ou VBAL, les obligations sont déjà dedans — n'en achetez pas en plus. Prenez des obligations en dollars canadiens, ou des obligations étrangères couvertes contre le risque de change : non couvert, un fonds obligataire étranger est surtout un pari sur les devises, soit l'inverse de la raison pour laquelle on détient des obligations.",
    statePension: { name: "RPC + SV", lookup: "canada.ca — Mon dossier Service Canada donne votre estimation réelle du RPC" },
  },

  US: {
    name: "États-Unis",
    inCountry: "aux États-Unis",
    accounts: [
      { name: "401(k) jusqu'à la contribution de l'employeur", note: "Ne laissez jamais la contribution de l'employeur sur la table." },
      { name: "IRA Roth ou traditionnel", note: "Roth si vous prévoyez payer plus d'impôt plus tard ; traditionnel si vous en prévoyez moins." },
      { name: "Le reste du 401(k)", note: "Remplissez-le jusqu'au plafond annuel si vous le pouvez." },
      { name: "Compte-titres imposable", note: "Une fois les comptes avantagés remplis." },
    ],
    fundGuidance:
      "Un fonds indiciel couvrant tout le marché américain ou le S&P 500, accompagné d'un fonds international — ou un seul fonds à date cible qui s'en occupe pour vous.",
    examples: [
      { name: "Vanguard Total World Stock ETF", ticker: "VT", note: "Tous les marchés investissables du monde dans un seul fonds." },
      { name: "Vanguard Total Stock Market ETF", ticker: "VTI", note: "Tout le marché américain. À associer à VXUS pour le reste du monde." },
      { name: "Fidelity 500 Index Fund", ticker: "FXAIX", note: "Un fonds commun plutôt qu'un FNB, à des frais quasi nuls." },
      { name: "Fonds Vanguard Target Retirement", note: "Choisissez l'année de votre retraite et il ajoute les obligations à votre place. Le moins d'effort possible." },
    ],
    pitfall:
      "Un menu 401(k) cache souvent un seul fonds indiciel bon marché parmi des fonds gérés coûteux : cherchez le ratio de frais le plus bas, avec « index » ou « S&P 500 » dans le nom. Méfiez-vous aussi de l'assurance vie entière vendue comme un placement ; c'en est rarement un.",
    bondExamples: [
      { name: "Vanguard Total Bond Market ETF", ticker: "BND", note: "Pratiquement tout le marché obligataire américain dans un fonds." },
      { name: "iShares Core U.S. Aggregate Bond ETF", ticker: "AGG", note: "La même exposition chez un autre fournisseur." },
      { name: "Fidelity U.S. Bond Index Fund", ticker: "FXNAX", note: "La version fonds commun, si cela convient mieux à votre compte." },
    ],
    bondNote:
      "Un fonds à date cible détient déjà des obligations pour vous — n'en rajoutez pas. Achetez des obligations dans votre propre devise, ou couvertes : non couvert, un fonds obligataire étranger est surtout un pari sur les devises.",
    statePension: { name: "Social Security", lookup: "ssa.gov — votre relevé indique votre prestation prévue" },
  },

  GB: {
    name: "Royaume-Uni",
    inCountry: "au Royaume-Uni",
    accounts: [
      { name: "Régime de retraite d'entreprise", note: "Cotisez au moins assez pour obtenir la totalité de la contribution de l'employeur." },
      { name: "Stocks & Shares ISA", note: "Croissance libre d'impôt, et vous pouvez retirer à tout moment." },
      { name: "SIPP", note: "Avantage fiscal à l'entrée, bloqué jusqu'à l'âge de la retraite." },
      { name: "Compte d'investissement ordinaire", note: "Seulement après avoir utilisé votre plafond ISA." },
    ],
    fundGuidance:
      "Un fonds indiciel actions mondial UCITS — un seul tracker « all-world » suffit. Les parts capitalisantes simplifient tout.",
    examples: [
      { name: "Vanguard FTSE All-World UCITS ETF (Acc)", ticker: "VWRP", note: "Le monde entier dans un fonds. Capitalisant : les dividendes se réinvestissent seuls." },
      { name: "iShares Core MSCI World UCITS ETF", ticker: "SWDA", note: "Marchés développés. Très largement détenu." },
      { name: "Vanguard LifeStrategy 80% Equity", note: "Actions et obligations dans un seul fonds, rééquilibré pour vous." },
    ],
    pitfall:
      "La plateforme facture des frais en plus de ceux du fonds : vérifiez les deux. Évitez les contrats « with-profits » et tout conseiller qui propose de gérer votre ISA contre un pourcentage — l'enveloppe fiscale est gratuite et le choix du fonds prend dix minutes.",
    bondExamples: [
      { name: "Vanguard Global Aggregate Bond UCITS ETF (couvert GBP)", ticker: "VAGP", note: "Obligations d'État et d'entreprises du monde entier, couvertes en livres." },
      { name: "Vanguard Global Bond Index Fund (couvert GBP)", note: "La version fonds de la même chose." },
      { name: "iShares Core UK Gilts UCITS ETF", ticker: "IGLT", note: "Uniquement des obligations d'État britanniques — plus simple, sans risque de change." },
    ],
    bondNote:
      "Un fonds LifeStrategy contient déjà des obligations — ne doublez pas. Prenez la version couverte en GBP de tout fonds obligataire mondial : sans couverture, vous pariez surtout sur les devises.",
    statePension: { name: "State Pension", lookup: "gov.uk/check-state-pension" },
  },

  FR: {
    name: "France",
    inCountry: "en France",
    accounts: [
      { name: "PEA", note: "Avantage fiscal après cinq ans. L'enveloppe actions par défaut." },
      { name: "Assurance-vie", note: "Souple, avec ses propres avantages fiscaux après huit ans." },
      { name: "PER", note: "Dédié à la retraite, déductible aujourd'hui, bloqué jusqu'à la retraite." },
      { name: "Compte-titres", note: "Pour tout ce qui ne rentre pas dans les enveloppes ci-dessus." },
    ],
    fundGuidance:
      "Un ETF actions monde UCITS. Dans un PEA, cherchez les trackers monde éligibles au PEA.",
    examples: [
      { name: "Amundi MSCI World (PEA)", ticker: "CW8", note: "Le tracker monde éligible au PEA de longue date." },
      { name: "iShares Core MSCI World Swap PEA", ticker: "WPEA", note: "La même exposition, environ 0,25 % par an." },
      { name: "BNP Paribas Easy S&P 500 (PEA)", note: "Grandes capitalisations américaines, environ 0,15 % par an." },
    ],
    pitfall:
      "Dans un PEA, les trackers monde sont forcément synthétiques : le fonds détient un panier d'actions européennes et échange sa performance contre celle de l'indice mondial, car un PEA ne peut pas détenir directement des actions hors Europe. C'est normal, ce n'est pas un signal d'alarme. Le vrai piège, ce sont les contrats d'assurance-vie qui empilent frais de gestion et unités de compte à 2 % par an.",
    bondExamples: [
      { name: "Fonds euros (dans une assurance-vie)", note: "Le placement sûr classique en France : capital garanti par l'assureur. Pour la plupart des gens, c'est la partie obligataire, et aucun ETF n'est nécessaire." },
      { name: "Amundi Euro Government Bond UCITS ETF", note: "Obligations d'État de la zone euro, pour un compte-titres ou certains contrats PER." },
      { name: "iShares Core Global Aggregate Bond UCITS ETF (couvert EUR)", ticker: "AGGH", note: "Obligations mondiales couvertes en euros." },
    ],
    bondNote:
      "Les obligations n'ont pas leur place dans un PEA : c'est une enveloppe actions. En France, la partie stable se loge plutôt dans le fonds euros d'une assurance-vie, qui remplit le même rôle. Si vous achetez un ETF obligataire, prenez la version couverte en euros : sans couverture, c'est surtout un pari sur les devises.",
    statePension: { name: "Retraite de base + complémentaire", lookup: "info-retraite.fr — votre estimation consolidée" },
  },

  DE: {
    name: "Allemagne",
    inCountry: "en Allemagne",
    accounts: [
      { name: "Betriebliche Altersvorsorge", note: "Régime d'entreprise — prenez toute contribution de l'employeur disponible." },
      { name: "Compte-titres avec Sparerpauschbetrag", note: "Utilisez l'abattement annuel sur les revenus de placement." },
      { name: "Riester / Rürup", note: "À vérifier selon votre situation ; cela ne convient pas à tout le monde." },
    ],
    fundGuidance:
      "Un ETF monde UCITS via un Sparplan mensuel. Les parts capitalisantes réduisent la paperasse au minimum.",
    examples: [
      { name: "Vanguard FTSE All-World UCITS ETF (Acc)", ticker: "VWCE", note: "Le monde entier, capitalisant. La réponse par défaut pour la plupart des épargnants allemands." },
      { name: "iShares Core MSCI World UCITS ETF", ticker: "IWDA", note: "Marchés développés, très gros et établi de longue date." },
      { name: "SPDR MSCI ACWI IMI UCITS ETF", note: "Le monde, petites capitalisations et marchés émergents inclus." },
    ],
    pitfall:
      "Un Sparplan bancaire sur un fonds géré activement peut prélever un Ausgabeaufschlag allant jusqu'à 5 % avant même que vous ayez gagné quoi que ce soit, plus des frais annuels. Un Sparplan chez un courtier sur un ETF large ne coûte souvent rien par opération.",
    bondExamples: [
      { name: "iShares Core Global Aggregate Bond UCITS ETF (couvert EUR)", ticker: "AGGH", note: "Obligations d'État et d'entreprises mondiales, couvertes en euros." },
      { name: "Xtrackers Eurozone Government Bond UCITS ETF", note: "Uniquement des obligations d'État de la zone euro." },
      { name: "Tagesgeld ou Festgeld", note: "Sur un horizon court, un simple compte de dépôt remplit le même rôle sans variations de prix." },
    ],
    bondNote:
      "Prenez toujours la part couverte en EUR d'un fonds obligataire mondial : sans couverture, vous pariez surtout sur le dollar. Pour de l'argent nécessaire d'ici quelques années, le Tagesgeld est souvent préférable à un fonds obligataire.",
    statePension: { name: "Gesetzliche Rente", lookup: "deutsche-rentenversicherung.de — votre Renteninformation" },
  },

  AU: {
    name: "Australie",
    inCountry: "en Australie",
    accounts: [
      { name: "Superannuation", note: "Vérifiez les frais de votre fonds et que vous êtes sur une option de croissance s'il vous reste des décennies." },
      { name: "Versements volontaires dans le super", note: "Les cotisations concessionnelles sont imposées à 15 %, souvent bien en dessous de votre taux marginal." },
      { name: "Compte de courtage", note: "Pour l'argent dont vous pourriez avoir besoin avant l'âge de déblocage." },
    ],
    fundGuidance:
      "Un FNB indiciel mondial coté en Australie, ou l'option internationale indicielle à bas coût de votre fonds de super.",
    examples: [
      { name: "BetaShares Diversified All Growth ETF", ticker: "DHHF", note: "Uniquement des actions, le monde entier, un seul fonds." },
      { name: "Vanguard Diversified High Growth Index ETF", ticker: "VDHG", note: "Environ 90 % d'actions avec une petite part d'obligations." },
      { name: "Vanguard MSCI International Shares ETF", ticker: "VGS", note: "Tout ce qui est hors d'Australie. Souvent associé à VAS pour les actions locales." },
    ],
    pitfall:
      "Les fonds de super grand public peuvent facturer plusieurs fois le coût d'une option indicielle proposée dans le même fonds. Connectez-vous, trouvez l'option internationale indicielle et comparez les frais — c'est souvent la chose la plus rentable que vous ferez d'un après-midi.",
    bondExamples: [
      { name: "Vanguard Australian Fixed Interest Index ETF", ticker: "VAF", note: "Obligations australiennes d'État et d'entreprises dans un seul fonds." },
      { name: "Vanguard Australian Government Bond Index ETF", ticker: "VGB", note: "Uniquement des obligations d'État — la plus stable des deux." },
      { name: "Vanguard Global Aggregate Bond Index (couvert)", ticker: "VBND", note: "Obligations mondiales couvertes en dollars australiens." },
    ],
    bondNote:
      "VDHG contient déjà des obligations ; DHHF n'en contient volontairement aucune. Vérifiez lequel vous détenez avant d'en ajouter. Votre fonds de super en détient aussi pour vous dans la plupart des options. Prenez toujours la version couverte d'un fonds obligataire mondial.",
    statePension: { name: "Age Pension", lookup: "servicesaustralia.gov.au" },
  },

  OTHER: {
    name: "Ailleurs",
    inCountry: "dans votre pays",
    accounts: [
      { name: "Tout régime de retraite d'employeur", note: "Surtout si les cotisations sont abondées." },
      { name: "L'enveloppe fiscale de votre pays", note: "Presque tous les pays en proposent une. La trouver est l'heure la mieux investie de votre vie financière." },
      { name: "Un compte de courtage ordinaire", note: "Une fois les options avantagées utilisées." },
    ],
    fundGuidance:
      "Un fonds indiciel actions mondial à frais réduits, acheté dans votre propre devise si possible.",
    examples: [
      { name: "Un fonds ou ETF indiciel mondial large", note: "Cherchez « All-World », « MSCI World », « ACWI » ou « total market » dans le nom." },
      { name: "Un fonds à date cible", note: "Si votre fournisseur en propose un pour votre année de retraite, il gère la transition vers les obligations à votre place." },
    ],
    pitfall:
      "Si vous n'êtes pas contribuable américain, méfiez-vous des ETF domiciliés aux États-Unis : ils peuvent exposer votre succession à l'impôt américain au-delà d'un seuil bas, et beaucoup de courtiers européens ne peuvent pas vous les vendre. Cherchez un fonds domicilié en Irlande ou au Luxembourg (généralement marqué UCITS).",
    bondExamples: [
      { name: "Un fonds d'obligations d'État dans votre devise", note: "Cherchez aggregate, government ou total bond dans le nom." },
      { name: "Un fonds obligataire mondial couvert dans votre devise", note: "La couverture de change compte bien plus pour les obligations que pour les actions." },
      { name: "Un simple compte d'épargne ou de dépôt", note: "Pour de l'argent nécessaire d'ici quelques années, il remplit le même rôle sans variations de prix." },
    ],
    bondNote:
      "Si vous détenez un fonds tout-en-un ou à date cible, les obligations sont déjà dedans — n'en achetez pas séparément. Et prenez toujours la version couverte dans la devise que vous dépensez : sans couverture, un fonds obligataire étranger est surtout un pari sur les devises.",
    statePension: { name: "Pension d'État", lookup: "L'organisme de retraite de votre pays" },
  },
};
