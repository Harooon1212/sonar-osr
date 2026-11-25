"""
ResNet-50 Backbone and Closed-Set Classifier for Underwater Sonar Images.
Provides classification logits and GAP feature representations matching the trained benchmark.
"""

import torch
import torch.nn as nn
from torchvision import models
from configs.config import NUM_CLASSES


def build_resnet50(num_classes=NUM_CLASSES, pretrained=False):
    """
    Constructs ResNet-50 with 2-layer classifier head matching osr_Full.ipynb and osr_checkpoint.pth.
    """
    weights = models.ResNet50_Weights.IMAGENET1K_V1 if pretrained else None
    model = models.resnet50(weights=weights)

    in_features = model.fc.in_features  # 2048
    model.fc = nn.Sequential(
        nn.Dropout(p=0.3),
        nn.Linear(in_features, 512),
        nn.ReLU(),
        nn.Dropout(p=0.2),
        nn.Linear(512, num_classes),
    )
    return model


class ResNet50Baseline(nn.Module):
    """
    Backwards-compatible wrapper around ResNet-50.
    """

    def __init__(self, num_classes=NUM_CLASSES, pretrained=False):
        super().__init__()
        self.model = build_resnet50(num_classes=num_classes, pretrained=pretrained)

    def extract_features(self, x):
        x = self.model.conv1(x)
        x = self.model.bn1(x)
        x = self.model.relu(x)
        x = self.model.maxpool(x)
        x = self.model.layer1(x)
        x = self.model.layer2(x)
        x = self.model.layer3(x)
        x = self.model.layer4(x)
        x = self.model.avgpool(x)
        return torch.flatten(x, 1)

    def forward(self, x):
        return self.model(x)

    def forward_with_features(self, x):
        feats = self.extract_features(x)
        logits = self.model.fc(feats)
        return logits, feats
