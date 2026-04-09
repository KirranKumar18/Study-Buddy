interface FormulaBoxProps {
  formula: {
    name: string;
    formula: string;
    variables: string;
    whenToUse: string;
  };
}

export const FormulaBox = ({ formula }: FormulaBoxProps) => {
  return (
    <div className="p-6 bg-gradient-to-br from-primary/5 to-accent/5 rounded-xl border-2 border-primary/20">
      <h4 className="font-bold text-lg mb-3">{formula.name}</h4>
      <div className="p-4 bg-background/80 rounded-lg mb-4">
        <p className="text-3xl font-mono font-bold text-center text-primary">{formula.formula}</p>
      </div>
      <div className="space-y-2 text-sm">
        <div>
          <span className="font-semibold">Variables: </span>
          <span className="text-muted-foreground">{formula.variables}</span>
        </div>
        <div>
          <span className="font-semibold">When to use: </span>
          <span className="text-muted-foreground">{formula.whenToUse}</span>
        </div>
      </div>
    </div>
  );
};
