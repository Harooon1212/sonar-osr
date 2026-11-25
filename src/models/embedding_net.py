"""
Deep Metric Learning (DML) Embedding Network.
Maps ResNet-50 GAP representations through a projection head to an L2-normalized hypersphere.
Matches osr_Full.ipynb and osr_checkpoint.pth.
"""

import torch
import torch.nn as nn
import torch.nn.functional as F
from torchvision import models
from configs.config import EMBEDDING_DIM


class EmbeddingNet(nn.Module):
    """
    ResNet-50 backbone + Multi-Layer Perceptron (MLP) projection head.
    Outputs L2-normalized embedding vectors optimized for Triplet Loss metric learning.
    """

    def __init__(self, embedding_dim=EMBEDDING_DIM, pretrained=False):
        super().__init__()
        weights = models.ResNet50_Weights.IMAGENET1K_V1 if pretrained else None
        resnet = models.resnet50(weights=weights)

        # Feature extractor up to GAP layer
        self.backbone = nn.Sequential(*list(resnet.children())[:-1])

        # Projection head: 2048 -> 512 -> embedding_dim (matching osr_checkpoint.pth)
        self.projector = nn.Sequential(
            nn.Linear(2048, 512),
            nn.BatchNorm1d(512),
            nn.ReLU(),
            nn.Dropout(0.3),
            nn.Linear(512, embedding_dim),
        )
        self.embedding_dim = embedding_dim

    def forward(self, x):
        """
        Forward pass yielding unit-normalized embeddings.
        Shape: (B, embedding_dim)
        """
        feats = self.backbone(x)
        feats = torch.flatten(feats, 1)
        embeddings = self.projector(feats)
        return F.normalize(embeddings, p=2, dim=1)
