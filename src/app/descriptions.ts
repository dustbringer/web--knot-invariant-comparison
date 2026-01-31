const descriptions: { [name: string]: { abbr: string; description: string } } =
  {
    A2: {
      abbr: "A2",
      description: "SL3 polynomial",
    },
    Alexander: {
      abbr: "A",
      description: "Alexander polynomial",
    },
    B1: {
      abbr: "B1",
      description: "SO3 Polynonmial; 2 coloured Jones polynomial",
    },
    BV: {
      abbr: "BV",
      description: "Bar-Natan and van der Veen's Theta (non Alexander part)",
    },
    BVSp: {
      abbr: "BVSp",
      description:
        "Bar-Natan and van der Veen's Theta (non Alexander part) specialised at t1=22/7, t2=21/13",
    },
    "Alexander+BV": {
      abbr: "A+BV",
      description: "Bar-Natan and van der Veen's Theta (full)",
    },
    "AlexanderSp+BVSp": {
      abbr: "ASp+BVSp",
      description:
        "Bar-Natan and van der Veen's Theta (full) specialised at t1=22/7, t2=21/13",
    },
    HFK2: {
      abbr: "HFK2",
      description: "HFK homology (p=2)",
    },
    HFK2T1: {
      abbr: "HFK2T1",
      description: "HFK homology (p=2) specialising t=1",
    },
    HOMFLYPT: {
      abbr: "H",
      description: "HOMFLYPT polynomial",
    },
    HOMFLYPTHomology: {
      abbr: "HH",
      description: "HOMFLYPT homology",
    },
    Jones: {
      abbr: "J",
      description: "Jones polynomial",
    },
    Khovanov: {
      abbr: "K",
      description: "Khovanov homology",
    },
    KhovanovT1: {
      abbr: "KT1",
      description: "Khovanov homology specialising t=1",
    },
    KhovanovOdd: {
      abbr: "KO",
      description: "Odd Khovanov homology",
    },
    KR3: {
      abbr: "KR3",
      description: "SL3 homology (Khovanov--Rozansky)",
    },
    V1: {
      abbr: "V1",
      description: "Nichols algebra version of the Links-Gould polynomial", // Garoufalidis Kashaev
    },
    V2: {
      abbr: "V2",
      description: "Higher version of V1",
    },
    All: {
      abbr: "All",
      description: "Everything together",
    },
    "J+KT1": {
      abbr: "J+KT1",
      description: "Jones and KhovanovT1 together",
    },
  };

export default descriptions;
