import { Card, CardContent, Skeleton} from '@mui/material';

export default function BookCardSkeleton() {
  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        p: 0
      }}
    >
      {/* Capa */}
      <Skeleton
        variant="rectangular"
        height={240}
        width="100%"
        sx={{ borderRadius: 2 }}
      />

      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {/* Título */}
        <Skeleton variant="text" width="80%" height={28} />

        {/* Autor */}
        <Skeleton variant="rounded" width="50%" height={22} />

        {/* Descrição */}
        <Skeleton variant="text" width="100%" height={16} />
        <Skeleton variant="text" width="90%" height={16} />
        <Skeleton variant="text" width="70%" height={16} />
      </CardContent>
    </Card>
  );
}
