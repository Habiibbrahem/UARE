// src/pages/ProductPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    Box,
    Typography,
    Card,
    CardMedia,
    Button,
    TextField,
    Divider,
    Chip,
    Breadcrumbs,
    IconButton,
    Rating,
    Alert,
    Skeleton,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    List,
    ListItem,
    ListItemText,
    Grid,
    Container
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { ShoppingCart, Favorite, Share, ExpandMore } from '@mui/icons-material';

import axiosInstance from '../services/axiosInstance';
import {
    getProductById,
    getProductRecommendations
} from '../services/productService';
import useCartStore from '../store/useCartStore';

// ─── Styled Components ──────────────────────────────────────────────────────────
const PageContainer = styled(Box)(({ theme }) => ({
    paddingTop: theme.spacing(12),
    paddingBottom: theme.spacing(6),
    backgroundColor: theme.palette.background.default
}));
const ProductContainer = styled(Container)(({ theme }) => ({
    maxWidth: 1400,
    margin: '0 auto',
    padding: theme.spacing(4),
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius * 2,
    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.08)'
}));
const StyledBreadcrumbs = styled(Breadcrumbs)(({ theme }) => ({
    marginBottom: theme.spacing(3),
    '& a': {
        textDecoration: 'none',
        color: theme.palette.primary.main,
        '&:hover': { textDecoration: 'underline' }
    }
}));
const ProductGrid = styled('div')(({ theme }) => ({
    display: 'grid',
    gridTemplateColumns: '1.2fr 1fr',
    gap: theme.spacing(6),
    [theme.breakpoints.down('lg')]: { gridTemplateColumns: '1fr', gap: theme.spacing(4) }
}));
const ImageCard = styled(Card)(({ theme }) => ({
    borderRadius: theme.shape.borderRadius * 3,
    boxShadow: 'none',
    border: `1px solid ${theme.palette.divider}`,
    overflow: 'hidden',
    transition: 'transform 0.3s ease',
    '&:hover': { transform: 'scale(1.02)' }
}));
const ProductImage = styled(CardMedia)(() => ({
    width: '100%',
    height: 500,
    objectFit: 'contain',
    backgroundColor: '#f9f9f9'
}));
const ThumbnailContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    gap: theme.spacing(2),
    marginTop: theme.spacing(2)
}));
const Thumbnail = styled('img')(({ theme, selected }) => ({
    width: 60,
    height: 60,
    objectFit: 'cover',
    borderRadius: theme.shape.borderRadius,
    cursor: 'pointer',
    border: selected ? `2px solid ${theme.palette.primary.main}` : `1px solid ${theme.palette.divider}`,
    opacity: selected ? 1 : 0.7,
    transition: 'all 0.2s ease',
    '&:hover': { opacity: 1 }
}));
const DetailSection = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(3)
}));
const ProductTitle = styled(Typography)(({ theme }) => ({
    fontWeight: 700,
    lineHeight: 1.2,
    marginBottom: theme.spacing(2),
    fontSize: '2rem',
    [theme.breakpoints.down('sm')]: { fontSize: '1.5rem' }
}));
const SectionTitle = styled(Typography)(({ theme }) => ({
    fontWeight: 600,
    color: theme.palette.text.secondary,
    marginBottom: theme.spacing(1),
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontSize: '0.85rem'
}));
const ProductDescription = styled(Typography)(({ theme }) => ({
    color: theme.palette.text.secondary,
    lineHeight: 1.7,
    marginBottom: theme.spacing(3)
}));
const PriceBox = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1.5),
    marginBottom: theme.spacing(1)
}));
const OriginalPrice = styled(Typography)(({ theme }) => ({
    textDecoration: 'line-through',
    color: theme.palette.text.disabled
}));
const VariantSection = styled(Box)(({ theme }) => ({
    marginBottom: theme.spacing(3),
    '& .MuiChip-root': {
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        borderRadius: theme.shape.borderRadius,
        fontWeight: 500,
        marginRight: theme.spacing(1),
        marginBottom: theme.spacing(1)
    },
    '& .MuiChip-filled': { backgroundColor: theme.palette.primary.main, color: theme.palette.primary.contrastText }
}));
const QuantityField = styled(TextField)(({ theme }) => ({
    maxWidth: 100,
    '& .MuiOutlinedInput-root': { borderRadius: theme.shape.borderRadius * 2 }
}));
const ActionsBox = styled(Box)(({ theme }) => ({
    display: 'flex',
    gap: theme.spacing(2),
    alignItems: 'center',
    marginTop: theme.spacing(3)
}));
const RecommendationsBox = styled(Box)(({ theme }) => ({
    marginTop: theme.spacing(8),
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius * 2,
    padding: theme.spacing(4),
    boxShadow: '0px 2px 12px rgba(0,0,0,0.04)'
}));
const RecommendationCard = styled(Card)(({ theme }) => ({
    borderRadius: theme.shape.borderRadius * 2,
    boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
    textAlign: 'center',
    transition: 'transform 0.2s',
    '&:hover': { transform: 'scale(1.03)' },
    padding: theme.spacing(1.5, 1, 2),
    height: '100%'
}));
const RecentlyBox = styled(Box)(({ theme }) => ({
    marginTop: theme.spacing(5),
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius * 2,
    padding: theme.spacing(4),
    boxShadow: '0px 1px 8px rgba(0,0,0,0.025)'
}));

export default function ProductPage() {
    const { productId } = useParams();
    const [product, setProduct] = useState(null);
    const [recommendations, setRecommendations] = useState([]);
    const [recentProducts, setRecentProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [recLoading, setRecLoading] = useState(false);
    const [recentLoading, setRecentLoading] = useState(false);
    const [error, setError] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [selectedColor, setSelectedColor] = useState('');
    const [selectedSize, setSelectedSize] = useState('');
    const [mainImage, setMainImage] = useState('');
    const addToCart = useCartStore((state) => state.addToCart);

    // Gestion des produits récemment consultés
    const RECENT_KEY = 'recently_viewed_products';
    function addToRecentlyViewed(id) {
        let arr = [];
        try {
            arr = JSON.parse(localStorage.getItem(RECENT_KEY) || '[]');
        } catch {
            arr = [];
        }
        arr = arr.filter(pid => pid !== id);
        arr.unshift(id);
        if (arr.length > 12) arr = arr.slice(0, 12);
        localStorage.setItem(RECENT_KEY, JSON.stringify(arr));
    }
    function getRecentlyViewedExceptCurrent(currentId) {
        try {
            let arr = JSON.parse(localStorage.getItem(RECENT_KEY) || '[]');
            return arr.filter(pid => pid !== currentId).slice(0, 8);
        } catch {
            return [];
        }
    }

    useEffect(() => {
        setLoading(true);
        setError(null);
        setRecommendations([]);
        setRecentProducts([]);
        addToRecentlyViewed(productId);

        getProductById(productId)
            .then((res) => {
                setProduct(res.data);
                setMainImage(res.data.image);
                if (res.data.colors?.length) setSelectedColor(res.data.colors[0]);
                if (res.data.sizes?.length) setSelectedSize(res.data.sizes[0]);
                setRecLoading(true);
                getProductRecommendations(productId)
                    .then(r => setRecommendations(r.data))
                    .finally(() => setRecLoading(false));
            })
            .catch((err) => setError(err.message || 'Échec du chargement du produit'))
            .finally(() => setLoading(false));
    }, [productId]);

    useEffect(() => {
        setRecentLoading(true);
        const ids = getRecentlyViewedExceptCurrent(productId);
        if (!ids.length) {
            setRecentProducts([]);
            setRecentLoading(false);
            return;
        }
        Promise.all(ids.map(id => getProductById(id).then(r => r.data).catch(() => null)))
            .then(resArr => setRecentProducts(resArr.filter(x => !!x)))
            .finally(() => setRecentLoading(false));
    }, [productId]);

    if (loading) return (
        <PageContainer>
            <ProductContainer>
                <Skeleton variant="rectangular" width="100%" height={500} />
            </ProductContainer>
        </PageContainer>
    );

    if (error) return (
        <PageContainer>
            <Alert severity="error" sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
                {error}
            </Alert>
        </PageContainer>
    );

    if (!product) return (
        <PageContainer>
            <Alert severity="warning" sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
                Produit introuvable
            </Alert>
        </PageContainer>
    );

    const handleAddToCart = () => addToCart({
        productId: product._id,
        name: product.name,
        price: product.discount ? (product.price * (1 - product.discount / 100)) : product.price,
        image: product.image,
        quantity: Number(quantity),
        color: selectedColor,
        size: selectedSize,
        storeId: product.storeId,
    });

    const images = [product.image, ...(product.additionalImages || [])];

    return (
        <PageContainer>
            <ProductContainer>
                <StyledBreadcrumbs aria-label="breadcrumb">
                    <Link to="/">Accueil</Link>
                    <Link to={`/store/${product.storeId}`}>Boutique</Link>
                    <Typography color="text.primary">{product.name}</Typography>
                </StyledBreadcrumbs>

                <ProductGrid>
                    <Box>
                        <ImageCard>
                            <ProductImage
                                component="img"
                                image={`${axiosInstance.defaults.baseURL}${mainImage}`}
                                alt={product.name}
                            />
                        </ImageCard>
                        {images.length > 1 && (
                            <ThumbnailContainer>
                                {images.map((img, i) => (
                                    <Thumbnail
                                        key={i}
                                        src={`${axiosInstance.defaults.baseURL}${img}`}
                                        selected={mainImage === img}
                                        onClick={() => setMainImage(img)}
                                    />
                                ))}
                            </ThumbnailContainer>
                        )}
                    </Box>

                    <DetailSection>
                        <ProductTitle variant="h1">{product.name}</ProductTitle>

                        <Box display="flex" alignItems="center" gap={1} mb={2}>
                            <Rating value={product.rating || 0} precision={0.5} readOnly />
                            <Typography variant="body2" color="text.secondary">
                                ({product.reviewCount || 0} avis)
                            </Typography>
                        </Box>

                        {product.discount ? (
                            <PriceBox>
                                <Typography variant="h4" color="primary">
                                    {(product.price * (1 - product.discount / 100)).toFixed(2)} TND
                                </Typography>
                                <OriginalPrice variant="body1">
                                    {product.price.toFixed(2)} TND
                                </OriginalPrice>
                                <Chip label={`${product.discount}% de réduction`} color="error" size="small" />
                            </PriceBox>
                        ) : (
                            <Typography variant="h4" color="primary">
                                {product.price.toFixed(2)} TND
                            </Typography>
                        )}

                        {product.quantity > 0 ? (
                            <Typography variant="body2" color="success.main">
                                En stock ({product.quantity} disponibles)
                            </Typography>
                        ) : (
                            <Typography variant="body2" color="error">
                                Rupture de stock
                            </Typography>
                        )}

                        <ProductDescription variant="body1">
                            {product.description}
                        </ProductDescription>
                        <Divider />

                        {product.colors?.length > 0 && (
                            <VariantSection>
                                <SectionTitle>Couleur</SectionTitle>
                                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                    {product.colors.map(c => (
                                        <Chip
                                            key={c}
                                            label={c}
                                            onClick={() => setSelectedColor(c)}
                                            variant={selectedColor === c ? 'filled' : 'outlined'}
                                            color="primary"
                                        />
                                    ))}
                                </Box>
                            </VariantSection>
                        )}

                        {product.sizes?.length > 0 && (
                            <VariantSection>
                                <SectionTitle>Taille</SectionTitle>
                                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                    {product.sizes.map(s => (
                                        <Chip
                                            key={s}
                                            label={s}
                                            onClick={() => setSelectedSize(s)}
                                            variant={selectedSize === s ? 'filled' : 'outlined'}
                                            color="primary"
                                        />
                                    ))}
                                </Box>
                            </VariantSection>
                        )}

                        <VariantSection>
                            <SectionTitle>Quantité</SectionTitle>
                            <QuantityField
                                type="number"
                                value={quantity}
                                onChange={e => setQuantity(Math.max(1, Number(e.target.value)))}
                                inputProps={{ min: 1 }}
                                variant="outlined"
                                size="small"
                            />
                        </VariantSection>

                        <ActionsBox>
                            <Button
                                variant="contained"
                                size="large"
                                startIcon={<ShoppingCart />}
                                onClick={handleAddToCart}
                                disabled={product.quantity <= 0}
                            >
                                Ajouter au panier
                            </Button>
                            <IconButton aria-label="Ajouter aux favoris">
                                <Favorite />
                            </IconButton>
                            <IconButton aria-label="Partager">
                                <Share />
                            </IconButton>
                        </ActionsBox>

                        <Accordion elevation={0}>
                            <AccordionSummary expandIcon={<ExpandMore />}>
                                <Typography fontWeight="500">Détails du produit</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography paragraph>
                                    {product.longDescription || 'Aucun détail supplémentaire disponible.'}
                                </Typography>
                                {product.specifications?.length > 0 && (
                                    <>
                                        <Divider sx={{ my: 2 }} />
                                        <Typography variant="subtitle2" gutterBottom>Spécifications</Typography>
                                        <List dense>
                                            {product.specifications.map((spec, i) => (
                                                <ListItem key={i}>
                                                    <ListItemText primary={`${spec.name} : ${spec.value}`} />
                                                </ListItem>
                                            ))}
                                        </List>
                                    </>
                                )}
                            </AccordionDetails>
                        </Accordion>
                    </DetailSection>
                </ProductGrid>

                {/* --- SECTION RECOMMANDATIONS --- */}
                <RecommendationsBox>
                    <Typography variant="h5" fontWeight="700" mb={3}>
                        Vous aimerez aussi
                    </Typography>
                    {recLoading ? (
                        <Grid container spacing={2}>
                            {Array.from({ length: 4 }).map((_, i) => (
                                <Grid item xs={12} sm={6} md={3} key={i}>
                                    <Skeleton variant="rectangular" height={220} />
                                </Grid>
                            ))}
                        </Grid>
                    ) : recommendations.length === 0 ? (
                        <Typography color="text.secondary">Aucune recommandation disponible.</Typography>
                    ) : (
                        <Grid container spacing={3}>
                            {recommendations.map(rec => (
                                <Grid item xs={12} sm={6} md={3} key={rec._id}>
                                    <RecommendationCard>
                                        <Link to={`/product/${rec._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                            <CardMedia
                                                component="img"
                                                height="160"
                                                image={
                                                    rec.image
                                                        ? `${axiosInstance.defaults.baseURL}${rec.image}`
                                                        : '/no-image.png'
                                                }
                                                alt={rec.name}
                                                style={{ objectFit: 'contain', background: '#fafbfc' }}
                                            />
                                            <Typography variant="subtitle1" fontWeight="600" mt={1} noWrap>
                                                {rec.name}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" mb={1} noWrap>
                                                {rec.categoryId?.name || ''}
                                            </Typography>
                                            <Typography variant="h6" color="primary">
                                                {(rec.price || 0).toFixed(2)} TND
                                            </Typography>
                                        </Link>
                                    </RecommendationCard>
                                </Grid>
                            ))}
                        </Grid>
                    )}
                </RecommendationsBox>

                {/* --- SECTION PRODUITS RECEMMENT CONSULTES --- */}
                <RecentlyBox>
                    <Typography variant="h6" fontWeight="700" mb={3}>
                        Produits récemment consultés
                    </Typography>
                    {recentLoading ? (
                        <Grid container spacing={2}>
                            {Array.from({ length: 4 }).map((_, i) => (
                                <Grid item xs={12} sm={6} md={3} key={i}>
                                    <Skeleton variant="rectangular" height={180} />
                                </Grid>
                            ))}
                        </Grid>
                    ) : recentProducts.length === 0 ? (
                        <Typography color="text.secondary">Aucun produit récemment consulté.</Typography>
                    ) : (
                        <Grid container spacing={3}>
                            {recentProducts.map(rec => (
                                <Grid item xs={12} sm={6} md={3} key={rec._id}>
                                    <RecommendationCard>
                                        <Link to={`/product/${rec._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                            <CardMedia
                                                component="img"
                                                height="120"
                                                image={
                                                    rec.image
                                                        ? `${axiosInstance.defaults.baseURL}${rec.image}`
                                                        : '/no-image.png'
                                                }
                                                alt={rec.name}
                                                style={{ objectFit: 'contain', background: '#fafbfc' }}
                                            />
                                            <Typography variant="subtitle1" fontWeight="600" mt={1} noWrap>
                                                {rec.name}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" mb={1} noWrap>
                                                {rec.categoryId?.name || ''}
                                            </Typography>
                                            <Typography variant="h6" color="primary">
                                                {(rec.price || 0).toFixed(2)} TND
                                            </Typography>
                                        </Link>
                                    </RecommendationCard>
                                </Grid>
                            ))}
                        </Grid>
                    )}
                </RecentlyBox>
            </ProductContainer>
        </PageContainer>
    );
}