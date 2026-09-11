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
      lede: "You do not need to pick stocks. You do not need to pay someone every year to pick them for you. For almost everyone, one boring fund and a monthly transfer beats both — and then you can forget about it.",
      quote:
        "Consistently buy an S&P 500 low-cost index fund. Keep buying it through thick and thin, and especially through thin.",
      quoteWho: "Warren Buffett",
      quoteWhy: "He also explained why you rarely hear this advice: nobody earns a commission for giving it.",
      cta: "Build my plan — 5 minutes",
      secondary: "Why this works",
    },

    intro: {
      title: "Five questions. No signup, no email.",
      body: "Everything is worked out on your own computer. Nothing you type is sent anywhere or saved.",
      start: "Start",
    },

    wizard: {
      steps: ["Where you live", "Your age", "Your money", "Your retirement", "How you feel about risk"],
      stepOf: (a: number, b: number) => `Question ${a} of ${b}`,
      back: "Back",
      next: "Continue",

      country: "Which country do you live in?",
      countryHelp:
        "Each country has special accounts that let your money grow without tax. Picking the right one is the single most valuable thing on this page.",

      age: "How old are you?",
      retireAge: "At what age would you like to stop working?",
      retireInvalid: "This needs to be a later age than your current one.",
      retireYears: (n: number) => `That gives your money ${n} years to grow.`,

      savings: (cur: string) => `How much have you already saved or invested? (${cur})`,
      savingsHelp: "Include savings accounts, workplace pensions and investments. If the answer is nothing, put 0 — that is a normal place to start.",
      monthly: (cur: string) => `How much can you put aside each month? (${cur})`,
      monthlyHelp: "Give the honest number, not the hopeful one. You can always increase it later.",

      income: (cur: string) => `Once retired, how much would you like to live on each month? (${cur})`,
      incomeHelp:
        "In today's prices. A good starting point: what your life costs now, minus anything that will be paid off by then, like a mortgage.",
      pension: (name: string, cur: string) => `Expected ${name}, if you know it (${cur} per month)`,
      pensionHelp: (lookup: string) =>
        `Optional. Leave it at 0 and whatever you receive is a bonus. You can look yours up at ${lookup}.`,

      riskIntro: "Last one. There are no wrong answers — this only adjusts how cautious your plan is.",
      typeExact: "or type an exact amount",
      yearsOld: (n: number) => `${n} years old`,
      atAge: (n: number) => `at ${n}`,
      perMonth: "a month",
      recapTitle: "So far",
      none: "Nothing yet",
      quickPick: "Quick pick:",
      risk: [
        {
          prompt: "Your savings lose 30% of their value in a year. What would you really do?",
          options: ["Sell — I could not watch that happen", "Leave it alone and wait", "Put more in while prices are low"],
        },
        {
          prompt: "Which worries you more?",
          options: ["Seeing my savings drop sharply for a year or two", "Both about the same", "Running out of money when I am old"],
        },
        {
          prompt: "Have you ever kept money invested during a market crash?",
          options: ["No, and the thought makes me nervous", "No, but I think I would manage", "Yes, and I did not sell"],
        },
      ],
    },

    results: {
      eyebrow: "Your plan",
      onTrack: "You are on track.",
      gap: "Here is what is missing, and how to fix it.",
      summary: (income: string, target: string, age: number) =>
        `To take out ${income} every month for the rest of your life, you need about ${target} saved by age ${age}. That figure is in today's prices, so you can compare it to what things cost now.`,
      targetLabel: "What you need",
      projectedLabel: "What you are on course for",
      addLabel: "Put aside each month",
      shortfall: (current: string, needed: string, diff: string) =>
        `You are saving ${current} a month. Increasing that to ${needed} would close the gap — a difference of ${diff} a month. If that is not possible right now, working even one or two years longer changes this number a surprising amount.`,
      restart: "Start again",

      allocationWhy: (years: number) =>
        `You have ${years} years. That is the main reason for this split. Time is what makes the ups and downs of the stock market safe to live through, so a long wait allows more shares, and a short wait allows fewer.`,
      allocationWhat:
        "Shares here means one fund that owns a small piece of thousands of companies at once — never companies you choose yourself.",

      orderTitle: "Do this, in this order",
      orderEnd:
        "Then set up an automatic transfer every month and stop looking at it. People who check often tend to sell when prices fall, which is the main way ordinary savers lose money.",
    },

    charts: {
      allocationTitle: "Where your money goes",
      allocationSub: "Share of your total savings",
      stocks: "shares",
      bonds: "bonds",
      stocksLong: "in one fund that owns the whole market",
      bondsLong: "in bonds (the steady part)",

      projectionTitle: "Your savings, year by year",
      projectionSub: "In today's prices",
      target: "you need",
      hoverHint: "Point at the chart to read any year.",
      atAge: (age: number, amount: string) => `At age ${age}: ${amount}`,

      feesTitle: "What fees cost you",
      feesSub: "Same investments, same returns",
      feesLede:
        "The only difference between these three is the yearly charge. Nobody is choosing better investments — the whole gap is cost.",
      perYear: (pct: string) => `(${pct} a year)`,
      lostToFees: (amount: string) => `${amount} of your money goes to fees`,
      youKeep: "You keep",
      takenInFees: "Taken in fees",
      feeNames: ["A simple index fund", "An advisor choosing for you", "A managed fund"],
    },

    buy: {
      title: "What to actually buy",
      lede: (country: string) =>
        `The hard part is usually the gap between "buy a broad fund" and knowing which one. These are examples you can buy ${country}. They are examples, not recommendations — within this type, they are almost interchangeable, which is the point.`,
      trap: (country: string) => `The trap to avoid ${country}`,
      criteriaTitle: "How to spot a good one yourself",
      criteriaLede:
        "Fund names and prices change. These five questions do not. Use them on anything you are offered, including by your own bank.",
      criteria: [
        {
          test: "Does it cost less than about 0.30% a year?",
          why: "This charge has different names in different countries. Above roughly 0.5% you are paying for something that does not help you.",
        },
        {
          test: "Does it own hundreds or thousands of companies?",
          why: "Not one industry, one country or one idea. Owning everything is the whole point.",
        },
        {
          test: "Does the name contain All-World, MSCI World, ACWI, S&P 500 or total market?",
          why: "These are the plain, broad ones. An exciting name usually means a more expensive fund.",
        },
        {
          test: "Has it existed for years and does it hold billions?",
          why: "Big, old and dull means it will still be there in thirty years.",
        },
        {
          test: "Is there no joining fee, exit fee or performance fee?",
          why: "A joining fee takes a slice before you have earned anything. It is never necessary.",
        },
      ],
      closing:
        "If a fund passes all five, it is almost certainly fine. If someone wants a yearly percentage of your savings to choose one for you, that is the cost this whole page is about.",
    },

    learn: {
      title: "Why this works",
      lede: "Six ideas. Together they are most of what anyone needs, and they have not changed in fifty years.",
      lessons: [
        {
          title: "Owning everything beats guessing",
          body: "One fund can own a tiny piece of every large company at once. You are not betting on which one wins — you are betting that people keep working and companies keep earning. That is a much easier bet, and it has paid off for a very long time.",
        },
        {
          title: "The fee is the one thing you can control",
          body: "Nobody can promise you a return. Anyone can promise you a cost. A 1% yearly fee sounds tiny and quietly takes a large share of everything you earn, because it is charged for as many years as your money grows.",
        },
        {
          title: "Staying in beats timing it",
          body: "Waiting for the right moment usually means missing the recovery. The best days often arrive right after the frightening ones. Staying put through the bad years is the entire strategy.",
        },
        {
          title: "Bonds are there to steady the boat",
          body: "Bonds grow slowly. Their job is to stop a crash forcing you to sell at the worst time, in the years when you actually need the money. That is why you hold more of them as retirement gets close.",
        },
        {
          title: "Choosing shares is a full-time job",
          body: "People who do this all day, with teams and information you cannot buy, mostly fail to do better than simply owning everything. That is not a comment on your ability. It means the game is not worth your evenings.",
        },
        {
          title: "Set it up, then leave it alone",
          body: "Arrange a transfer each month and let it run. Savers who watch closely tend to sell when prices fall and buy when they rise, which is exactly backwards. Boring is not a compromise here. It is how it works.",
        },
      ],
    },

    footer: {
      title: "This is education, not financial advice.",
      body: (assumptions: string) =>
        `This site is not a financial advisor and knows nothing about you beyond five answers. ${assumptions} Those are planning assumptions, not promises — real markets do not rise by the same amount every year, and your own result will differ. Tax rules differ by country and change over time. Check anything here against your own situation. If you do want help, look for an advisor who charges one flat fee rather than a percentage of your savings every year.`,
      assumptions:
        "The projections assume long-run historical returns after inflation — 5% a year for shares and 1.5% for bonds — and that you withdraw 4% of your savings a year once retired.",
      builtBy: "Built by",
      openSource: "Open source — the calculations live in",
      andTested: "and are covered by tests.",
    },
  },

  fr: {
    langName: "Français",
    switchTo: "Switch to English",

    hero: {
      eyebrow: "Ennuyeux, volontairement",
      title: "Investir, expliqué en cinq minutes.",
      lede: "Vous n'avez pas besoin de choisir des actions. Vous n'avez pas besoin de payer quelqu'un chaque année pour les choisir à votre place. Pour presque tout le monde, un seul fonds ennuyeux et un virement mensuel font mieux que les deux — et ensuite vous pouvez l'oublier.",
      quote:
        "Achetez régulièrement un fonds indiciel S&P 500 à frais réduits. Continuez d'en acheter dans les bonnes comme dans les mauvaises périodes, et surtout dans les mauvaises.",
      quoteWho: "Warren Buffett",
      quoteWhy:
        "Il a aussi expliqué pourquoi on entend rarement ce conseil : personne ne touche de commission pour le donner.",
      cta: "Créer mon plan — 5 minutes",
      secondary: "Pourquoi ça marche",
    },

    intro: {
      title: "Cinq questions. Sans inscription, sans courriel.",
      body: "Tout est calculé sur votre propre ordinateur. Rien de ce que vous saisissez n'est envoyé ni conservé.",
      start: "Commencer",
    },

    wizard: {
      steps: ["Où vous vivez", "Votre âge", "Votre argent", "Votre retraite", "Votre rapport au risque"],
      stepOf: (a: number, b: number) => `Question ${a} sur ${b}`,
      back: "Retour",
      next: "Continuer",

      country: "Dans quel pays vivez-vous ?",
      countryHelp:
        "Chaque pays propose des comptes spéciaux où votre argent grandit sans impôt. Choisir le bon est la chose la plus utile de toute cette page.",

      age: "Quel âge avez-vous ?",
      retireAge: "À quel âge aimeriez-vous arrêter de travailler ?",
      retireInvalid: "Cet âge doit être plus élevé que votre âge actuel.",
      retireYears: (n: number) => `Votre argent a donc ${n} ans pour grandir.`,

      savings: (cur: string) => `Combien avez-vous déjà épargné ou investi ? (${cur})`,
      savingsHelp:
        "Comptez l'épargne, les régimes de retraite au travail et les placements. Si la réponse est rien, mettez 0 — c'est un point de départ tout à fait normal.",
      monthly: (cur: string) => `Combien pouvez-vous mettre de côté chaque mois ? (${cur})`,
      monthlyHelp: "Donnez le chiffre honnête, pas le chiffre espéré. Vous pourrez toujours l'augmenter plus tard.",

      income: (cur: string) => `Une fois à la retraite, de combien aimeriez-vous vivre chaque mois ? (${cur})`,
      incomeHelp:
        "Aux prix d'aujourd'hui. Un bon repère : ce que votre vie coûte maintenant, moins ce qui sera remboursé d'ici là, comme un prêt immobilier.",
      pension: (name: string, cur: string) => `${name} prévue, si vous la connaissez (${cur} par mois)`,
      pensionHelp: (lookup: string) =>
        `Facultatif. Laissez 0 et tout ce que vous recevrez sera un bonus. Vous pouvez vérifier la vôtre sur ${lookup}.`,

      riskIntro:
        "Dernière étape. Il n'y a pas de mauvaise réponse — cela sert seulement à rendre votre plan plus ou moins prudent.",
      typeExact: "ou saisissez un montant exact",
      yearsOld: (n: number) => `${n} ans`,
      atAge: (n: number) => `à ${n} ans`,
      perMonth: "par mois",
      recapTitle: "Jusqu'ici",
      none: "Rien pour l'instant",
      quickPick: "Choix rapide :",
      risk: [
        {
          prompt: "Votre épargne perd 30 % de sa valeur en un an. Que feriez-vous vraiment ?",
          options: [
            "Je vendrais — je ne pourrais pas supporter ça",
            "Je n'y toucherais pas et j'attendrais",
            "J'en achèterais plus pendant que les prix sont bas",
          ],
        },
        {
          prompt: "Qu'est-ce qui vous inquiète le plus ?",
          options: [
            "Voir mon épargne chuter fortement pendant un an ou deux",
            "Les deux autant l'un que l'autre",
            "Manquer d'argent quand je serai âgé",
          ],
        },
        {
          prompt: "Avez-vous déjà gardé de l'argent investi pendant un krach boursier ?",
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
      gap: "Voici ce qui manque, et comment y remédier.",
      summary: (income: string, target: string, age: number) =>
        `Pour retirer ${income} chaque mois jusqu'à la fin de votre vie, il vous faut environ ${target} à ${age} ans. Ce montant est exprimé aux prix d'aujourd'hui, vous pouvez donc le comparer à ce que les choses coûtent maintenant.`,
      targetLabel: "Ce qu'il vous faut",
      projectedLabel: "Ce que vous aurez",
      addLabel: "À mettre de côté chaque mois",
      shortfall: (current: string, needed: string, diff: string) =>
        `Vous épargnez ${current} par mois. Passer à ${needed} comblerait l'écart — une différence de ${diff} par mois. Si ce n'est pas possible aujourd'hui, travailler ne serait-ce qu'un ou deux ans de plus change ce chiffre de façon surprenante.`,
      restart: "Recommencer",

      allocationWhy: (years: number) =>
        `Il vous reste ${years} ans. C'est la raison principale de cette répartition. C'est le temps qui rend les hauts et les bas de la bourse supportables : une longue attente permet plus d'actions, une courte attente en permet moins.`,
      allocationWhat:
        "Ici, actions veut dire un seul fonds qui possède une petite part de milliers d'entreprises à la fois — jamais des entreprises que vous choisissez vous-même.",

      orderTitle: "Faites ceci, dans cet ordre",
      orderEnd:
        "Ensuite, mettez en place un virement automatique chaque mois et arrêtez de regarder. Ceux qui vérifient souvent ont tendance à vendre quand les prix baissent, et c'est la principale façon dont les épargnants perdent de l'argent.",
    },

    charts: {
      allocationTitle: "Où va votre argent",
      allocationSub: "Part de votre épargne totale",
      stocks: "actions",
      bonds: "obligations",
      stocksLong: "dans un fonds qui possède tout le marché",
      bondsLong: "en obligations (la partie stable)",

      projectionTitle: "Votre épargne, année après année",
      projectionSub: "Aux prix d'aujourd'hui",
      target: "objectif",
      hoverHint: "Pointez le graphique pour lire n'importe quelle année.",
      atAge: (age: number, amount: string) => `À ${age} ans : ${amount}`,

      feesTitle: "Ce que les frais vous coûtent",
      feesSub: "Mêmes placements, mêmes rendements",
      feesLede:
        "La seule différence entre ces trois cas est le frais annuel. Personne ne choisit de meilleurs placements — tout l'écart vient du coût.",
      perYear: (pct: string) => `(${pct} par an)`,
      lostToFees: (amount: string) => `${amount} de votre argent part en frais`,
      youKeep: "Ce qui vous reste",
      takenInFees: "Pris en frais",
      feeNames: ["Un simple fonds indiciel", "Un conseiller qui choisit pour vous", "Un fonds géré activement"],
    },

    buy: {
      title: "Quoi acheter concrètement",
      lede: (country: string) =>
        `Le plus dur, c'est souvent l'écart entre « achetez un fonds large » et savoir lequel. Voici des exemples disponibles ${country}. Ce sont des exemples, pas des recommandations — dans cette catégorie ils sont presque interchangeables, et c'est justement le principe.`,
      trap: (country: string) => `Le piège à éviter ${country}`,
      criteriaTitle: "Comment reconnaître un bon fonds vous-même",
      criteriaLede:
        "Les noms et les prix des fonds changent. Ces cinq questions, non. Posez-les sur tout ce qu'on vous propose, y compris à votre banque.",
      criteria: [
        {
          test: "Coûte-t-il moins d'environ 0,30 % par an ?",
          why: "Ce frais porte des noms différents selon les pays. Au-delà d'environ 0,5 %, vous payez pour quelque chose qui ne vous aide pas.",
        },
        {
          test: "Possède-t-il des centaines ou des milliers d'entreprises ?",
          why: "Pas un seul secteur, un seul pays ou une seule idée. Tout posséder, c'est tout l'intérêt.",
        },
        {
          test: "Le nom contient-il All-World, MSCI World, ACWI, S&P 500 ou total market ?",
          why: "Ce sont les fonds simples et larges. Un nom accrocheur signifie en général un fonds plus cher.",
        },
        {
          test: "Existe-t-il depuis des années et gère-t-il des milliards ?",
          why: "Gros, ancien et ennuyeux veut dire qu'il sera encore là dans trente ans.",
        },
        {
          test: "N'y a-t-il ni frais d'entrée, ni frais de sortie, ni commission de performance ?",
          why: "Des frais d'entrée prélèvent une part avant même que vous ayez gagné quoi que ce soit. Ce n'est jamais nécessaire.",
        },
      ],
      closing:
        "Si un fonds passe les cinq questions, il convient presque certainement. Si quelqu'un veut un pourcentage annuel de votre épargne pour en choisir un à votre place, c'est exactement le coût dont parle cette page.",
    },

    learn: {
      title: "Pourquoi ça marche",
      lede: "Six idées. Ensemble, elles suffisent à presque tout le monde, et elles n'ont pas changé depuis cinquante ans.",
      lessons: [
        {
          title: "Tout posséder vaut mieux que deviner",
          body: "Un seul fonds peut posséder une petite part de toutes les grandes entreprises à la fois. Vous ne pariez pas sur celle qui gagnera — vous pariez que les gens continueront de travailler et les entreprises de gagner de l'argent. C'est un pari bien plus facile, et il fonctionne depuis très longtemps.",
        },
        {
          title: "Les frais sont la seule chose que vous contrôlez",
          body: "Personne ne peut vous promettre un rendement. N'importe qui peut vous promettre un coût. Un frais de 1 % par an paraît minuscule et prend discrètement une grande part de tout ce que vous gagnez, car il est prélevé aussi longtemps que votre argent grandit.",
        },
        {
          title: "Rester investi vaut mieux que choisir le moment",
          body: "Attendre le bon moment revient souvent à manquer la remontée. Les meilleures journées arrivent souvent juste après les plus effrayantes. Rester en place pendant les mauvaises années, c'est toute la stratégie.",
        },
        {
          title: "Les obligations servent à stabiliser",
          body: "Les obligations rapportent peu. Leur rôle est d'éviter qu'un krach vous oblige à vendre au pire moment, les années où vous avez réellement besoin de l'argent. C'est pour cela qu'on en détient davantage à l'approche de la retraite.",
        },
        {
          title: "Choisir des actions est un métier à temps plein",
          body: "Des gens qui font cela toute la journée, avec des équipes et des informations que vous ne pouvez pas acheter, n'arrivent généralement pas à faire mieux que simplement tout posséder. Ce n'est pas un jugement sur vos capacités : cela veut dire que le jeu ne vaut pas vos soirées.",
        },
        {
          title: "Mettez-le en place, puis laissez-le tranquille",
          body: "Programmez un virement chaque mois et laissez faire. Les épargnants qui surveillent de près vendent quand les prix baissent et achètent quand ils montent, exactement l'inverse de ce qu'il faut. Ici, ennuyeux n'est pas un compromis. C'est le mécanisme.",
        },
      ],
    },

    footer: {
      title: "Ceci est de l'information, pas un conseil financier.",
      body: (assumptions: string) =>
        `Ce site n'est pas un conseiller financier et ne sait rien de vous au-delà de cinq réponses. ${assumptions} Ce sont des hypothèses de calcul, pas des promesses — les marchés ne montent pas du même montant chaque année, et votre résultat sera différent. Les règles fiscales varient d'un pays à l'autre et changent avec le temps. Vérifiez tout ce qui est écrit ici au regard de votre situation. Si vous voulez de l'aide, cherchez un conseiller qui facture un tarif fixe plutôt qu'un pourcentage annuel de votre épargne.`,
      assumptions:
        "Les projections retiennent les rendements historiques de long terme après inflation — 5 % par an pour les actions et 1,5 % pour les obligations — et un retrait de 4 % de votre épargne par an une fois à la retraite.",
      builtBy: "Réalisé par",
      openSource: "Code ouvert — les calculs se trouvent dans",
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
    // Private mode — fall through to the browser's own preference.
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
