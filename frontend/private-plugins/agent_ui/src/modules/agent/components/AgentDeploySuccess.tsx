export const AgentDeploySuccess = () => {
  return (
    <div className="flex flex-col items-center gap-3 py-2 text-center">
      <h3 className="font-medium text-sm">Agent deployed successfully</h3>
      <p className="text-muted-foreground text-xs">
        Your agent has been deployed successfully. You can use it now with
        discord bot.
      </p>
    </div>
  );
};
