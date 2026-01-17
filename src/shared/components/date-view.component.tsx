export const DateView: React.FC<{ date?: Date | string | null }> = ({
  date,
}) => {
  if (!date) {
    return <div className="text-center">-</div>;
  }

  const parsedDate = new Date(date);
  return (
    <>
      <div className="text-center">
        {parsedDate.toLocaleDateString()} - {parsedDate.toLocaleTimeString()}
      </div>
    </>
  );
};
