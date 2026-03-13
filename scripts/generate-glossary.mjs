import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outPath = join(__dirname, '..', 'data', 'glossary.json');

const terms = [
  { slug: 'limit-order', term: 'Limit Order', cat: 'trading', def: 'An order to buy or sell shares at a specific price or better. Limit orders sit in the orderbook until filled or cancelled.', related: ['market-order', 'orderbook', 'slippage'] },
  { slug: 'market-order', term: 'Market Order', cat: 'trading', def: 'An order executed immediately at the best available price. Guarantees execution but not price.', related: ['limit-order', 'slippage', 'fill-or-kill'] },
  { slug: 'fill-or-kill', term: 'Fill or Kill (FOK)', cat: 'trading', def: 'An order that must execute immediately in its entirety or be cancelled completely. No partial fills allowed.', related: ['market-order', 'limit-order', 'slippage'] },
  { slug: 'position-sizing', term: 'Position Sizing', cat: 'trading', def: 'Determining how much capital to allocate per trade. Prevents any single loss from crippling your bankroll.', related: ['bankroll-management', 'kelly-criterion', 'risk-reward-ratio'] },
  { slug: 'stop-loss', term: 'Stop Loss', cat: 'trading', def: 'A predetermined exit price to limit losses. In prediction markets, typically mental rather than automated.', related: ['take-profit', 'risk-reward-ratio', 'drawdown'] },
  { slug: 'take-profit', term: 'Take Profit', cat: 'trading', def: 'A predetermined exit price to lock in gains. Prevents giving back unrealized profits during reversals.', related: ['stop-loss', 'position-sizing', 'risk-reward-ratio'] },
  { slug: 'slippage', term: 'Slippage', cat: 'trading', def: 'The difference between expected and actual execution price. Increases in low-liquidity markets and with larger orders.', related: ['liquidity-pool', 'orderbook', 'market-order'] },
  { slug: 'spread', term: 'Spread', cat: 'trading', def: 'The difference between best bid and best ask price. Tighter spreads indicate more liquid markets with lower costs.', related: ['bid-ask', 'orderbook', 'market-maker'] },
  { slug: 'bid-ask', term: 'Bid-Ask', cat: 'trading', def: 'Bid is highest buyer price; ask is lowest seller price. The gap is the spread — the cost of immediate execution.', related: ['spread', 'orderbook', 'limit-order'] },
  { slug: 'leverage', term: 'Leverage', cat: 'trading', def: 'Using borrowed capital to amplify positions. Most prediction markets are fully collateralized with no leverage available.', related: ['position-sizing', 'risk-reward-ratio', 'bankroll-management'] },
  { slug: 'binary-market', term: 'Binary Market', cat: 'markets', def: 'A market with exactly two outcomes — YES or NO. Winners pay $1 per share, losers pay $0.', related: ['prediction-market', 'resolution', 'outcome'] },
  { slug: 'prediction-market', term: 'Prediction Market', cat: 'markets', def: 'A speculative market trading contracts on future event outcomes. Prices reflect aggregate probability estimates.', related: ['binary-market', 'implied-probability', 'outcome'] },
  { slug: 'resolution', term: 'Resolution', cat: 'markets', def: 'The process of determining and settling a market outcome. Winning shares pay $1, losing shares pay $0.', related: ['outcome', 'binary-market', 'event-contract'] },
  { slug: 'outcome', term: 'Outcome', cat: 'markets', def: 'A possible result of a prediction market. Binary markets have two (YES/NO); multi-outcome markets can have many.', related: ['resolution', 'binary-market', 'prediction-market'] },
  { slug: 'orderbook', term: 'Orderbook', cat: 'markets', def: 'Real-time list of all buy and sell orders organized by price. Shows available liquidity and best bid/ask.', related: ['bid-ask', 'spread', 'clob'] },
  { slug: 'liquidity-pool', term: 'Liquidity', cat: 'markets', def: 'Capital available for trading. Higher liquidity means less slippage and tighter spreads on execution.', related: ['orderbook', 'slippage', 'market-maker'] },
  { slug: 'market-maker', term: 'Market Maker', cat: 'markets', def: 'A participant providing liquidity by posting continuous buy and sell orders. Earns the spread but assumes inventory risk.', related: ['orderbook', 'spread', 'liquidity-pool'] },
  { slug: 'event-contract', term: 'Event Contract', cat: 'markets', def: 'A tradeable contract tied to a specific real-world event outcome. The building block of prediction markets.', related: ['prediction-market', 'binary-market', 'resolution'] },
  { slug: 'conditional-market', term: 'Conditional Market', cat: 'markets', def: 'A market whose resolution depends on another event occurring first. Creates complex probability dynamics.', related: ['binary-market', 'multi-outcome', 'prediction-market'] },
  { slug: 'multi-outcome', term: 'Multi-Outcome Market', cat: 'markets', def: 'A market with more than two possible outcomes. Each outcome trades independently; prices sum to approximately $1.', related: ['binary-market', 'outcome', 'prediction-market'] },
  { slug: 'alpha-score', term: 'Alpha Score', cat: 'analysis', def: 'Composite metric (0-100) measuring trading opportunity strength based on smart money consensus, divergence, and timing.', related: ['consensus-direction', 'edge', 'opportunity-score'] },
  { slug: 'consensus-direction', term: 'Consensus Direction', cat: 'analysis', def: 'Aggregate directional view of smart wallets. Shown as STRONG YES, STRONG NO, or SPLIT based on positioning.', related: ['alpha-score', 'smart-wallet', 'edge'] },
  { slug: 'edge', term: 'Edge', cat: 'analysis', def: 'Difference between market price and estimated true probability. Positive edge means mispricing in your favor.', related: ['alpha-score', 'consensus-direction', 'implied-probability'] },
  { slug: 'implied-probability', term: 'Implied Probability', cat: 'analysis', def: 'Probability implied by market price. A $0.65 YES share implies 65% probability. Compare to your estimate to find edge.', related: ['edge', 'prediction-market', 'binary-market'] },
  { slug: 'sharpe-ratio', term: 'Sharpe Ratio', cat: 'analysis', def: 'Risk-adjusted return metric. Excess return divided by volatility. Above 1.0 is good; above 3.0 is excellent.', related: ['profit-factor', 'drawdown', 'win-rate'] },
  { slug: 'win-rate', term: 'Win Rate', cat: 'analysis', def: 'Percentage of profitable trades. High win rate alone does not guarantee profitability — depends on win/loss size ratio.', related: ['profit-factor', 'expectancy', 'sharpe-ratio'] },
  { slug: 'drawdown', term: 'Drawdown', cat: 'analysis', def: 'Peak-to-trough decline in portfolio value. Maximum drawdown shows worst historical decline — key risk metric.', related: ['sharpe-ratio', 'bankroll-management', 'risk-reward-ratio'] },
  { slug: 'expectancy', term: 'Expectancy', cat: 'analysis', def: 'Average expected profit per trade: (win rate x avg win) - (loss rate x avg loss). Must be positive for viable strategy.', related: ['win-rate', 'profit-factor', 'edge'] },
  { slug: 'profit-factor', term: 'Profit Factor', cat: 'analysis', def: 'Gross profits divided by gross losses. Above 1.0 is profitable; above 1.5 is healthy; above 2.0 is excellent.', related: ['sharpe-ratio', 'win-rate', 'expectancy'] },
  { slug: 'annualized-return', term: 'Annualized Return', cat: 'analysis', def: 'Return scaled to one year. Short-duration prediction markets can show extremely high annualized returns.', related: ['opportunity-score', 'edge', 'alpha-score'] },
  { slug: 'polymarket', term: 'Polymarket', cat: 'platforms', def: 'Largest decentralized prediction market on Polygon blockchain. Uses USDC, CLOB matching, thousands of active markets.', related: ['clob', 'prediction-market', 'smart-wallet'] },
  { slug: 'kalshi', term: 'Kalshi', cat: 'platforms', def: 'US CFTC-regulated prediction market. Event contracts in USD with full regulatory compliance. Limited vs Polymarket selection.', related: ['polymarket', 'prediction-market', 'event-contract'] },
  { slug: 'copy-trading', term: 'Copy Trading', cat: 'platforms', def: 'Automatically mirroring trades of selected wallets. When a copied wallet trades, the same executes in your account.', related: ['smart-wallet', 'wallet-score', 'signal-arena'] },
  { slug: 'smart-wallet', term: 'Smart Wallet', cat: 'platforms', def: 'A wallet identified as consistently profitable. TradeSphere tracks 29,000+ wallets scored by historical performance.', related: ['copy-trading', 'wallet-score', 'consensus-direction'] },
  { slug: 'signal-arena', term: 'Signal Arena', cat: 'platforms', def: 'PolyFire leaderboard of AI bots paper-trading real orderbooks. Users subscribe to winning bot signals.', related: ['paper-trading', 'copy-trading', 'alpha-score'] },
  { slug: 'paper-trading', term: 'Paper Trading', cat: 'platforms', def: 'Simulated trading with real market data but no real money at risk. Used to test strategies and track bot performance.', related: ['signal-arena', 'copy-trading', 'smart-wallet'] },
  { slug: 'clob', term: 'CLOB', cat: 'platforms', def: 'Central Limit Order Book — order matching by price priority. Polymarket uses CLOB for transparent price discovery.', related: ['orderbook', 'polymarket', 'amm'] },
  { slug: 'amm', term: 'AMM', cat: 'platforms', def: 'Automated Market Maker — algorithmic liquidity via mathematical formula instead of individual orders. Simpler but less efficient.', related: ['clob', 'market-maker', 'liquidity-pool'] },
  { slug: 'api-trading', term: 'API Trading', cat: 'platforms', def: 'Programmatic trade execution via application programming interface. Enables algorithmic strategies and custom tools.', related: ['clob', 'signal-arena', 'polymarket'] },
  { slug: 'wallet-score', term: 'Wallet Score', cat: 'platforms', def: 'Composite rating (0-100) for tracked wallets based on performance, consistency, and patterns. Higher = more reliable.', related: ['smart-wallet', 'copy-trading', 'win-rate'] },
  { slug: 'bankroll-management', term: 'Bankroll Management', cat: 'risk', def: 'Managing total capital to survive losing streaks and maximize long-term growth. Never risk enough to be knocked out.', related: ['position-sizing', 'kelly-criterion', 'drawdown'] },
  { slug: 'risk-reward-ratio', term: 'Risk-Reward Ratio', cat: 'risk', def: 'Potential loss vs potential gain per trade. A $0.30 YES share risks 0.30 to gain 0.70 — roughly 1:2.3 ratio.', related: ['position-sizing', 'edge', 'implied-probability'] },
  { slug: 'max-drawdown', term: 'Maximum Drawdown', cat: 'risk', def: 'Largest percentage decline from peak to trough. The most important risk metric — shows worst case to survive.', related: ['drawdown', 'bankroll-management', 'sharpe-ratio'] },
  { slug: 'hedging', term: 'Hedging', cat: 'risk', def: 'Taking offsetting positions to reduce risk. Buy NO against YES, or trade correlated markets in opposite directions.', related: ['diversification', 'correlation', 'risk-reward-ratio'] },
  { slug: 'diversification', term: 'Diversification', cat: 'risk', def: 'Spreading capital across uncorrelated markets. Prevents single bad outcomes from devastating total returns.', related: ['correlation', 'hedging', 'bankroll-management'] },
  { slug: 'correlation', term: 'Correlation', cat: 'risk', def: 'Degree to which markets move together. High correlation reduces diversification benefit. Essential for portfolio risk.', related: ['diversification', 'hedging', 'variance'] },
  { slug: 'variance', term: 'Variance', cat: 'risk', def: 'How much returns deviate from average. Binary markets have inherently high per-trade variance.', related: ['sharpe-ratio', 'drawdown', 'tail-risk'] },
  { slug: 'kelly-criterion', term: 'Kelly Criterion', cat: 'risk', def: 'Optimal sizing formula: bet = edge / odds. Maximizes growth but is aggressive — use fractional Kelly (25-50%).', related: ['position-sizing', 'bankroll-management', 'edge'] },
  { slug: 'ruin-probability', term: 'Probability of Ruin', cat: 'risk', def: 'Chance of losing your entire bankroll given edge and sizing. Even profitable strategies have non-zero ruin risk if oversized.', related: ['bankroll-management', 'kelly-criterion', 'variance'] },
  { slug: 'tail-risk', term: 'Tail Risk', cat: 'risk', def: 'Risk of rare extreme outcomes outside normal expectations. When impossible events happen — low-probability markets resolving YES.', related: ['variance', 'max-drawdown', 'hedging'] },
];

const glossary = terms.map(t => ({
  slug: t.slug,
  term: t.term,
  definition: t.def,
  extendedDefinition: `${t.term} is a fundamental concept in prediction market trading. In platforms like Polymarket with thousands of active markets, understanding ${t.term.toLowerCase()} is essential for consistent profitability. TradeSphere data across 5,400+ markets shows that traders who master these concepts significantly outperform those trading on instinct.\n\nIn practice, ${t.term.toLowerCase()} connects to ${t.related.map(r => { const found = terms.find(x => x.slug === r); return found ? found.term : r; }).join(', ')}. PolyPulse tracks these metrics and publishes weekly analysis. For hands-on application, PolyFire provides real-time market data and copy trading via Telegram.`,
  relatedTerms: t.related,
  category: t.cat,
}));

writeFileSync(outPath, JSON.stringify(glossary, null, 2));
console.log(`Generated ${glossary.length} glossary terms`);
