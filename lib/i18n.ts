"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";

export type Lang = "en" | "fr";

/**
 * Plain dictionaries rather than an i18n library: the site is a static export
 * with two languages and no plurals to speak of, so a library would cost more
 * than it saves.
 *
 * Both languages are written for someone who has never invested. Short
 * sentences, no jargon without an immediate explanation, and nothing that
 * assumes the reader already knows what an index or a bond is.
 */
export const dict = {
  en: {
    langName: "English",
    switchTo: "Passer en français",

    hero: {
      eyebrow: "Boring on purpose",
      title: "Investing, explained in five minutes.",
      lede: "You don't need to pick shares. You don't need to pay someone a slice of your savings every year to pick them for you. For almost everyone, one dull fund and a monthly transfer beats both, and then you get to forget about it.",
      quote:
        "Consistently buy an S&P 500 low-cost index fund. Keep buying it through thick and thin, and especially through thin.",
      quoteWho: "Warren Buffett",
      quoteWhy: "He also explained why you rarely hear this advice. Nobody earns a commission for giving it.",
      cta: "Build my plan, 5 minutes",
      secondary: "Why this works",
    },

    disclaimer: {
      badge: "A learning tool, not financial advice",
      resultsTitle: "Remember, this is a learning tool and not financial advice",
      resultsBody:
        "These numbers come from five answers and some general assumptions. They're here to show you how this works, not to tell you what to do with your money. Nobody here knows your tax situation, your debts, your job or your health.",
      checkFirst:
        "Check anything here against your own situation before you act on it. If you'd like help, look for an advisor who charges one flat fee instead of taking a slice of your savings every year.",
    },

    intro: {
      title: "Five questions. No signup, no email.",
      body: "Everything is worked out on your own computer. Nothing you type is sent anywhere or saved.",
      start: "Let's go",
    },

    wizard: {
      steps: ["Where you live", "Your age", "Your money", "Your retirement", "How you feel about risk"],
      stepOf: (a: number, b: number) => `Question ${a} of ${b}`,
      back: "Back",
      next: "Next",

      country: "Which country do you live in?",
      countryHelp:
        "Every country has special accounts where your money can grow without being taxed. Knowing which one to use is the most valuable thing on this page.",

      age: "How old are you?",
      retireAge: "At what age would you like to stop working?",
      retireInvalid: "That needs to be older than you are now.",
      retireYears: (n: number) => `Good. Your money has ${n} years to grow.`,

      savings: (cur: string) => `How much have you saved or invested so far? (${cur})`,
      savingsHelp:
        "Savings accounts, workplace pensions, investments, all of it. If the answer is nothing, put zero. That's a perfectly normal place to start.",
      monthly: (cur: string) => `How much can you put away each month? (${cur})`,
      monthlyHelp: "Give the honest number rather than the hopeful one. You can always raise it later.",

      income: (cur: string) => `Once you've stopped working, how much would you like to live on each month? (${cur})`,
      incomeHelp:
        "In today's prices. A good starting point is what your life costs now, minus anything that'll be paid off by then, like a mortgage.",
      pension: (name: string, cur: string) => `Your expected ${name}, if you know it (${cur} a month)`,
      pensionHelp: (lookup: string) =>
        `This one's optional. Leave it at zero and anything you get is a bonus. You can look yours up at ${lookup}.`,

      riskIntro: "Last one. There are no wrong answers here. It only changes how cautious your plan is.",
      typeExact: "or type an exact amount",
      yearsOld: (n: number) => `${n} years old`,
      atAge: (n: number) => `at ${n}`,
      perMonth: "a month",
      recapTitle: "So far",
      none: "Nothing yet",
      quickPick: "Quick pick:",
      livePreview: "At this rate you'd have",
      livePreviewHint: "Change any answer and watch this move.",

      risk: [
        {
          prompt: "Your savings drop by 30% in a year. What would you really do?",
          options: ["Sell. I couldn't watch that happen", "Leave it alone and wait", "Buy more while it's cheap"],
        },
        {
          prompt: "Which of these worries you more?",
          options: [
            "Watching my savings fall for a year or two",
            "Both about the same",
            "Running out of money when I'm old",
          ],
        },
        {
          prompt: "Have you ever stayed invested through a crash?",
          options: ["No, and the idea makes me nervous", "No, but I think I'd hold on", "Yes, and I didn't sell"],
        },
      ],
    },

    results: {
      eyebrow: "Your plan",
      onTrack: "You're on track.",
      gap: "Here's the gap, and how to close it.",
      summary: (income: string, target: string, age: number) =>
        `To take out ${income} a month for the rest of your life, you'd need about ${target} by the time you're ${age}. That's in today's prices, so you can compare it to what things cost now.`,
      targetLabel: "What you need",
      projectedLabel: "What you're on course for",
      addLabel: "Put away each month",
      shortfall: (current: string, needed: string, diff: string) =>
        `You're saving ${current} a month right now. Going up to ${needed} would close the gap, which is ${diff} more a month. If that's out of reach today, working even one or two years longer moves this number more than you'd expect.`,
      restart: "Start again",

      horizonNote: (years: number, rate: string) =>
        `Retiring at that age means your money may need to last around ${years} years, so this plan assumes you take out ${rate} of it a year. Stopping work earlier means a longer retirement and a smaller safe slice, which is why the target moves when you change that age.`,
      rangeNote: (low: string, high: string) =>
        `Markets don't hand out the same return every year, so treat this as a range rather than a promise. A rougher run of decades gets you nearer ${low}, a kinder one nearer ${high}.`,

      allocationWhy: (years: number) =>
        `You have ${years} years. That's the main reason for this split. Time is what makes the ups and downs of the stock market survivable, so a long wait earns more shares and a short wait earns fewer.`,
      allocationWhat:
        "Shares here means one fund that owns a small piece of thousands of companies at once, never companies you pick yourself.",

      orderTitle: "The order people usually fill these",
      orderEnd:
        "Then set up a transfer every month and stop looking. People who check constantly tend to sell when prices fall, and that's the main way ordinary savers lose money.",
    },

    charts: {
      allocationTitle: "Where your money goes",
      allocationSub: "Share of your total savings",
      stocks: "shares",
      bonds: "bonds",
      stocksLong: "in one fund that owns the whole market",
      bondsLong: "in bonds, the steady part",

      projectionTitle: "Your savings, year by year",
      projectionSub: "In today's prices",
      target: "you need",
      hoverHint: "Point at the chart to read any year.",
      atAge: (age: number, amount: string) => `At ${age}: ${amount}`,
      rangeLabel: "Likely range",

      feesTitle: "What fees cost you",
      feesSub: "Same investments, same returns",
      feesLede:
        "The only difference between these three is the yearly charge. Nobody's picking better investments. The whole gap is cost.",
      perYear: (pct: string) => `(${pct} a year)`,
      lostToFees: (amount: string) => `${amount} of your money goes to fees`,
      youKeep: "You keep",
      takenInFees: "Taken in fees",
      feeNames: ["A simple index fund", "An advisor choosing for you", "A managed fund"],
    },

    buy: {
      title: "What to actually buy",
      lede: (country: string) =>
        `The hardest part is usually the gap between "buy a broad fund" and knowing which one. Here are some you can buy ${country}. They're examples rather than recommendations, and within this type they're almost interchangeable, which is rather the point.`,
      trap: (country: string) => `The trap to avoid ${country}`,
      bondsTitle: "And the bonds, the steady part",
      bondsLede:
        "Bonds are the calm half of your plan. You're lending money instead of owning companies, so they grow slowly and fall much less when markets drop. That's their whole job: making sure a crash never forces you to sell at the worst possible moment.",
      criteriaTitle: "How to spot a good one yourself",
      criteriaLede:
        "Fund names and prices change. These five questions don't. Use them on anything you're offered, including by your own bank.",
      criteria: [
        {
          test: "Does it cost less than about 0.30% a year?",
          why: "This charge goes by different names in different countries. Much above 0.5% and you're paying for something that isn't helping you.",
        },
        {
          test: "Does it own hundreds or thousands of companies?",
          why: "Not one industry, one country or one clever idea. Owning everything is the point.",
        },
        {
          test: "Does the name contain All-World, MSCI World, ACWI, S&P 500 or total market?",
          why: "Those are the plain, broad ones. An exciting name usually means a more expensive fund.",
        },
        {
          test: "Has it been around for years, holding billions?",
          why: "Big, old and dull means it'll still be there in thirty years.",
        },
        {
          test: "Is there no joining fee, exit fee or performance fee?",
          why: "A joining fee takes a slice before you've earned anything. It's never necessary.",
        },
      ],
      closing:
        "If a fund passes all five, it's almost certainly fine. And if someone wants a yearly percentage of your savings to pick one for you, that's exactly the cost this page is about.",
    },

    learn: {
      title: "Why this works",
      lede: "Six ideas. Together they're most of what anyone needs, and they haven't changed in fifty years.",
      lessons: [
        {
          title: "Owning everything beats guessing",
          body: "One fund can own a sliver of every large company at once. You're not betting on which one wins. You're betting that people keep working and companies keep earning, which is a far easier bet, and it has paid off for a very long time.",
        },
        {
          title: "The fee is the one thing you control",
          body: "Nobody can promise you a return. Anyone can promise you a cost. A 1% yearly fee sounds like nothing and quietly takes a large share of everything you earn, because it's charged for as many years as your money grows.",
        },
        {
          title: "Staying in beats timing it",
          body: "Waiting for the right moment usually means missing the recovery. The best days tend to arrive right after the frightening ones. Sitting still through the bad years is the whole strategy.",
        },
        {
          title: "Bonds are there to steady the boat",
          body: "Bonds grow slowly, and that's fine. Their job is to stop a crash forcing you to sell at the bottom in the years you actually need the money. That's why you hold more of them as you get closer to stopping work.",
        },
        {
          title: "Picking shares is a full-time job",
          body: "People who do this all day, with teams and data you can't buy, mostly fail to beat simply owning everything. That's not a comment on you. It means the game isn't worth your evenings.",
        },
        {
          title: "Set it up, then leave it alone",
          body: "Arrange a transfer each month and let it run. Savers who watch closely tend to sell when prices fall and buy when they rise, which is exactly backwards. Boring isn't a compromise here. It's the mechanism.",
        },
      ],
    },

    footer: {
      title: "This is education, not financial advice.",
      body: (assumptions: string) =>
        `This site isn't a financial advisor and knows nothing about you beyond five answers. ${assumptions} Those are planning assumptions rather than promises. Real markets don't rise by the same amount every year, and your own result will be different. Tax rules vary by country and change over time. Check anything here against your own situation, and if you'd like help, look for an advisor who charges a flat fee rather than a percentage of your savings every year.`,
      assumptions:
        "The projections use long-run world returns after inflation, around 5% a year for shares and 1.5% for bonds, drawn from more than a century of data. How much you can safely take out each year is worked out from how long your retirement may last rather than a fixed 4%.",
      builtBy: "Built by",
      openSource: "Open source. The calculations live in",
      andTested: "and are covered by tests.",
    },
  },

  fr: {
    langName: "Français",
    switchTo: "Switch to English",

    hero: {
      eyebrow: "Ennuyeux, volontairement",
      title: "Investir, expliqué en cinq minutes.",
      lede: "Vous n'avez pas besoin de choisir des actions. Vous n'avez pas besoin de payer chaque année une part de votre épargne à quelqu'un pour qu'il les choisisse. Pour presque tout le monde, un fonds ennuyeux et un virement mensuel font mieux que les deux, et ensuite vous pouvez l'oublier.",
      quote:
        "Achetez régulièrement un fonds indiciel S&P 500 à frais réduits. Continuez d'en acheter dans les bonnes comme dans les mauvaises périodes, et surtout dans les mauvaises.",
      quoteWho: "Warren Buffett",
      quoteWhy: "Il a aussi expliqué pourquoi on entend rarement ce conseil. Personne ne touche de commission pour le donner.",
      cta: "Créer mon plan, 5 minutes",
      secondary: "Pourquoi ça marche",
    },

    disclaimer: {
      badge: "Un outil pédagogique, pas un conseil financier",
      resultsTitle: "Rappel : ceci est un outil pédagogique, pas un conseil financier",
      resultsBody:
        "Ces chiffres viennent de cinq réponses et d'hypothèses générales. Ils servent à vous montrer comment ça marche, pas à vous dire quoi faire de votre argent. Personne ici ne connaît votre situation fiscale, vos dettes, votre emploi ni votre santé.",
      checkFirst:
        "Vérifiez tout au regard de votre situation avant d'agir. Si vous voulez de l'aide, cherchez un conseiller qui facture un tarif fixe plutôt que de prendre une part de votre épargne chaque année.",
    },

    intro: {
      title: "Cinq questions. Sans inscription, sans courriel.",
      body: "Tout est calculé sur votre propre ordinateur. Rien de ce que vous saisissez n'est envoyé ni conservé.",
      start: "C'est parti",
    },

    wizard: {
      steps: ["Où vous vivez", "Votre âge", "Votre argent", "Votre retraite", "Votre rapport au risque"],
      stepOf: (a: number, b: number) => `Question ${a} sur ${b}`,
      back: "Retour",
      next: "Suivant",

      country: "Dans quel pays vivez-vous ?",
      countryHelp:
        "Chaque pays propose des comptes spéciaux où votre argent grandit sans être imposé. Savoir lequel utiliser est ce qu'il y a de plus utile sur cette page.",

      age: "Quel âge avez-vous ?",
      retireAge: "À quel âge aimeriez-vous arrêter de travailler ?",
      retireInvalid: "Cet âge doit être supérieur à votre âge actuel.",
      retireYears: (n: number) => `Très bien. Votre argent a ${n} ans pour grandir.`,

      savings: (cur: string) => `Combien avez-vous épargné ou investi jusqu'ici ? (${cur})`,
      savingsHelp:
        "Comptes d'épargne, régimes de retraite au travail, placements, tout compte. Si la réponse est rien, mettez zéro. C'est un point de départ parfaitement normal.",
      monthly: (cur: string) => `Combien pouvez-vous mettre de côté chaque mois ? (${cur})`,
      monthlyHelp: "Donnez le chiffre honnête plutôt que le chiffre espéré. Vous pourrez l'augmenter plus tard.",

      income: (cur: string) => `Une fois que vous aurez arrêté de travailler, de combien aimeriez-vous vivre chaque mois ? (${cur})`,
      incomeHelp:
        "Aux prix d'aujourd'hui. Un bon repère : ce que votre vie coûte maintenant, moins ce qui sera remboursé d'ici là, comme un prêt immobilier.",
      pension: (name: string, cur: string) => `Votre ${name} prévue, si vous la connaissez (${cur} par mois)`,
      pensionHelp: (lookup: string) =>
        `Celle-ci est facultative. Laissez zéro et tout ce que vous toucherez sera un bonus. Vous pouvez vérifier la vôtre sur ${lookup}.`,

      riskIntro: "Dernière question. Il n'y a pas de mauvaise réponse. Cela change seulement la prudence de votre plan.",
      typeExact: "ou saisissez un montant exact",
      yearsOld: (n: number) => `${n} ans`,
      atAge: (n: number) => `à ${n} ans`,
      perMonth: "par mois",
      recapTitle: "Jusqu'ici",
      none: "Rien pour l'instant",
      quickPick: "Choix rapide :",
      livePreview: "À ce rythme, vous auriez",
      livePreviewHint: "Modifiez une réponse et regardez ce chiffre bouger.",

      risk: [
        {
          prompt: "Votre épargne perd 30 % en un an. Que feriez-vous vraiment ?",
          options: [
            "Je vendrais. Je ne pourrais pas supporter ça",
            "Je n'y toucherais pas et j'attendrais",
            "J'en achèterais plus pendant que c'est bas",
          ],
        },
        {
          prompt: "Qu'est-ce qui vous inquiète le plus ?",
          options: [
            "Voir mon épargne baisser pendant un an ou deux",
            "Les deux autant l'un que l'autre",
            "Manquer d'argent quand je serai âgé",
          ],
        },
        {
          prompt: "Avez-vous déjà traversé un krach en restant investi ?",
          options: [
            "Non, et cette idée me rend nerveux",
            "Non, mais je pense que je tiendrais bon",
            "Oui, et je n'ai pas vendu",
          ],
        },
      ],
    },

    results: {
      eyebrow: "Votre plan",
      onTrack: "Vous êtes sur la bonne voie.",
      gap: "Voici l'écart, et comment le combler.",
      summary: (income: string, target: string, age: number) =>
        `Pour retirer ${income} par mois jusqu'à la fin de votre vie, il vous faudrait environ ${target} à ${age} ans. C'est exprimé aux prix d'aujourd'hui, vous pouvez donc le comparer à ce que les choses coûtent maintenant.`,
      targetLabel: "Ce qu'il vous faut",
      projectedLabel: "Ce que vous aurez",
      addLabel: "À mettre de côté chaque mois",
      shortfall: (current: string, needed: string, diff: string) =>
        `Vous épargnez ${current} par mois aujourd'hui. Passer à ${needed} comblerait l'écart, soit ${diff} de plus par mois. Si c'est hors de portée pour l'instant, travailler un ou deux ans de plus change ce chiffre bien plus que vous ne le croyez.`,
      restart: "Recommencer",

      horizonNote: (years: number, rate: string) =>
        `Partir à cet âge signifie que votre argent devra peut-être durer environ ${years} ans. Ce plan suppose donc que vous en retirez ${rate} par an. Arrêter plus tôt allonge la retraite et réduit la part que l'on peut retirer sans risque, ce qui explique que l'objectif bouge quand vous changez cet âge.`,
      rangeNote: (low: string, high: string) =>
        `Les marchés ne donnent pas le même rendement chaque année. Voyez donc ceci comme une fourchette, pas comme une promesse. Des décennies difficiles vous rapprochent de ${low}, des décennies favorables de ${high}.`,

      allocationWhy: (years: number) =>
        `Il vous reste ${years} ans. C'est la raison principale de cette répartition. C'est le temps qui rend les hauts et les bas de la bourse supportables : une longue attente permet plus d'actions, une courte attente en permet moins.`,
      allocationWhat:
        "Ici, actions veut dire un seul fonds qui possède une petite part de milliers d'entreprises à la fois, jamais des entreprises que vous choisissez vous-même.",

      orderTitle: "L'ordre dans lequel on remplit ces comptes, en général",
      orderEnd:
        "Ensuite, programmez un virement chaque mois et arrêtez de regarder. Ceux qui vérifient sans cesse ont tendance à vendre quand les prix baissent, et c'est la principale façon dont les épargnants perdent de l'argent.",
    },

    charts: {
      allocationTitle: "Où va votre argent",
      allocationSub: "Part de votre épargne totale",
      stocks: "actions",
      bonds: "obligations",
      stocksLong: "dans un fonds qui possède tout le marché",
      bondsLong: "en obligations, la partie stable",

      projectionTitle: "Votre épargne, année après année",
      projectionSub: "Aux prix d'aujourd'hui",
      target: "objectif",
      hoverHint: "Pointez le graphique pour lire n'importe quelle année.",
      atAge: (age: number, amount: string) => `À ${age} ans : ${amount}`,
      rangeLabel: "Fourchette probable",

      feesTitle: "Ce que les frais vous coûtent",
      feesSub: "Mêmes placements, mêmes rendements",
      feesLede:
        "La seule différence entre ces trois cas est le frais annuel. Personne ne choisit de meilleurs placements. Tout l'écart vient du coût.",
      perYear: (pct: string) => `(${pct} par an)`,
      lostToFees: (amount: string) => `${amount} de votre argent part en frais`,
      youKeep: "Ce qui vous reste",
      takenInFees: "Pris en frais",
      feeNames: ["Un simple fonds indiciel", "Un conseiller qui choisit pour vous", "Un fonds géré activement"],
    },

    buy: {
      title: "Quoi acheter concrètement",
      lede: (country: string) =>
        `Le plus dur, c'est l'écart entre « achetez un fonds large » et savoir lequel. En voici quelques-uns disponibles ${country}. Ce sont des exemples plutôt que des recommandations, et dans cette catégorie ils sont presque interchangeables, ce qui est justement le principe.`,
      trap: (country: string) => `Le piège à éviter ${country}`,
      bondsTitle: "Et les obligations, la partie stable",
      bondsLede:
        "Les obligations sont la moitié tranquille de votre plan. Vous prêtez de l'argent au lieu de posséder des entreprises : elles rapportent peu et baissent beaucoup moins quand les marchés chutent. C'est tout leur rôle : éviter qu'un krach vous force à vendre au pire moment.",
      criteriaTitle: "Comment reconnaître un bon fonds vous-même",
      criteriaLede:
        "Les noms et les prix des fonds changent. Ces cinq questions, non. Posez-les sur tout ce qu'on vous propose, y compris à votre banque.",
      criteria: [
        {
          test: "Coûte-t-il moins d'environ 0,30 % par an ?",
          why: "Ce frais porte des noms différents selon les pays. Bien au-delà de 0,5 %, vous payez pour quelque chose qui ne vous aide pas.",
        },
        {
          test: "Possède-t-il des centaines ou des milliers d'entreprises ?",
          why: "Pas un secteur, un pays ou une idée astucieuse. Tout posséder, c'est le principe.",
        },
        {
          test: "Le nom contient-il All-World, MSCI World, ACWI, S&P 500 ou total market ?",
          why: "Ce sont les fonds simples et larges. Un nom accrocheur annonce en général un fonds plus cher.",
        },
        {
          test: "Existe-t-il depuis des années, avec des milliards sous gestion ?",
          why: "Gros, ancien et ennuyeux veut dire qu'il sera encore là dans trente ans.",
        },
        {
          test: "N'y a-t-il ni frais d'entrée, ni frais de sortie, ni commission de performance ?",
          why: "Des frais d'entrée prélèvent une part avant même que vous ayez gagné quoi que ce soit. Ce n'est jamais nécessaire.",
        },
      ],
      closing:
        "Si un fonds passe les cinq questions, il convient presque certainement. Et si quelqu'un veut un pourcentage annuel de votre épargne pour en choisir un à votre place, c'est exactement le coût dont parle cette page.",
    },

    learn: {
      title: "Pourquoi ça marche",
      lede: "Six idées. Ensemble, elles suffisent à presque tout le monde, et elles n'ont pas changé depuis cinquante ans.",
      lessons: [
        {
          title: "Tout posséder vaut mieux que deviner",
          body: "Un seul fonds peut posséder une part minuscule de toutes les grandes entreprises à la fois. Vous ne pariez pas sur celle qui gagnera. Vous pariez que les gens continueront de travailler et les entreprises de gagner de l'argent, ce qui est un pari bien plus facile, et qui fonctionne depuis très longtemps.",
        },
        {
          title: "Les frais sont la seule chose que vous contrôlez",
          body: "Personne ne peut vous promettre un rendement. N'importe qui peut vous promettre un coût. Un frais de 1 % par an semble insignifiant et prend discrètement une grande part de tout ce que vous gagnez, car il est prélevé aussi longtemps que votre argent grandit.",
        },
        {
          title: "Rester investi vaut mieux que choisir le moment",
          body: "Attendre le bon moment revient souvent à manquer la remontée. Les meilleures journées arrivent en général juste après les plus effrayantes. Ne rien faire pendant les mauvaises années, c'est toute la stratégie.",
        },
        {
          title: "Les obligations servent à stabiliser",
          body: "Les obligations rapportent peu, et c'est très bien. Leur rôle est d'éviter qu'un krach vous force à vendre au plus bas les années où vous avez besoin de l'argent. C'est pour cela qu'on en détient davantage à l'approche de la retraite.",
        },
        {
          title: "Choisir des actions est un métier à temps plein",
          body: "Ceux qui font cela toute la journée, avec des équipes et des données que vous ne pouvez pas acheter, n'arrivent généralement pas à battre le simple fait de tout posséder. Ce n'est pas un jugement sur vous. Cela veut dire que le jeu ne vaut pas vos soirées.",
        },
        {
          title: "Mettez-le en place, puis laissez-le tranquille",
          body: "Programmez un virement chaque mois et laissez faire. Les épargnants qui surveillent de près vendent quand les prix baissent et achètent quand ils montent, exactement l'inverse. Ici, ennuyeux n'est pas un compromis. C'est le mécanisme.",
        },
      ],
    },

    footer: {
      title: "Ceci est de l'information, pas un conseil financier.",
      body: (assumptions: string) =>
        `Ce site n'est pas un conseiller financier et ne sait rien de vous au-delà de cinq réponses. ${assumptions} Ce sont des hypothèses de calcul, pas des promesses. Les marchés ne montent pas du même montant chaque année, et votre résultat sera différent. Les règles fiscales varient selon les pays et changent avec le temps. Vérifiez tout au regard de votre situation, et si vous voulez de l'aide, cherchez un conseiller qui facture un tarif fixe plutôt qu'un pourcentage annuel de votre épargne.`,
      assumptions:
        "Les projections utilisent les rendements mondiaux de long terme après inflation, environ 5 % par an pour les actions et 1,5 % pour les obligations, tirés de plus d'un siècle de données. Le montant que vous pouvez retirer chaque année sans risque est calculé à partir de la durée probable de votre retraite plutôt qu'un 4 % fixe.",
      builtBy: "Réalisé par",
      openSource: "Code ouvert. Les calculs se trouvent dans",
      andTested: "et sont couverts par des tests.",
    },
  },
} as const;

export type Dict = (typeof dict)["en"];

const STORAGE_KEY = "bop-lang";

/*
 * The chosen language is browser-only state, so it is held in a small external
 * store and read through useSyncExternalStore rather than set from an effect.
 *
 * Setting it in an effect works but costs a second render on every visit, and
 * lint rightly flags it. This way the server snapshot is always "en" (so the
 * markup it produces is stable and hydration matches), while the client reads
 * the stored or browser-detected value on its very first render.
 */
let current: Lang | null = null;
const listeners = new Set<() => void>();

function detect(): Lang {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "en" || stored === "fr") return stored;
  } catch {
    // Private mode, so fall through to the browser's own preference.
  }
  return navigator.language?.toLowerCase().startsWith("fr") ? "fr" : "en";
}

function getSnapshot(): Lang {
  if (current === null) current = detect();
  return current;
}

function getServerSnapshot(): Lang {
  return "en";
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function useLanguage() {
  const lang = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((next: Lang) => {
    current = next;
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Private mode: the choice simply will not persist.
    }
    listeners.forEach((cb) => cb());
  }, []);

  return { lang, setLang, t: dict[lang] as Dict };
}
