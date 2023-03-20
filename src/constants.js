export const coinValues = {
  cp: { cp: 1,    sp: 0.1,  ep: 0.02, gp: 0.01, pp: 0.001 }, // 100cp = 1gp
  sp: { cp: 10,   sp: 1,    ep: 0.2,  gp: 0.1,  pp: 0.01  }, // 10sp  = 1gp
  ep: { cp: 50,   sp: 5,    ep: 1,    gp: 0.5,  pp: 0.05  }, // 2ep   = 1gp
  gp: { cp: 100,  sp: 10,   ep: 2,    gp: 1,    pp: 0.1   }, // 1gp   = 1gp
  pp: { cp: 1000, sp: 100,  ep: 20,   gp: 10,   pp: 1     }, // 1pp   = 10gp
}