# Apache Spark Plugin for Backstage

Welcome to the Apache Spark plugin for Backstage!

This plugin allows you to display information related to your Apache Spark Applications running in Kubernetes on Backstage

## Getting started

![GIF](doc/images/demo1.gif)


### Configuration

[The Kubernetes plugin](https://backstage.io/docs/features/kubernetes/) must also be installed and enabled.  

Entities must be annotated with Kubernetes annotations. An example component
would look like the following where you can configure the `spec` to your
liking. Information specific to your Spark Operator goes under `annotations` as
shown below:

```yaml
apiVersion: backstage.io/v1alpha1
kind: Component
metadata:
  name: backstage
  annotations:
    backstage.io/kubernetes-namespace: default
    apache-spark.cnoe.io/label-selector: env=dev,my=label
spec:
  type: service
  lifecycle: experimental
  owner: user1
  system: system1
```

Update your Entity page. For example:
```typescript
// in packages/app/src/components/catalog/EntityPage.tsx

import {
  ApacheSparkPage
} from '@cnoe-io/plugin-apache-spark'

const serviceEntityPage = (
  <EntityLayout>

    ...

    <EntityLayout.Route path="/apache-spark" title="Spark" if={isApacheSparkAvailable}>
      <ApacheSparkPage />
    </EntityLayout.Route>

    ...
  </EntityLayout>
)

```

#### Annotations
- `apache-spark.cnoe.io/label-selector`: Required. This value corresponds to the label on
  the Pod running the Spark job.
- `backstage.io/kubernetes-namespace`: Optional. Defaults to the `default` namespace.
- `apache-spark.cnoe.io/cluster-name`: Optional. Specifies the name of Kubernetes cluster to retrieve information from.

### Authentication

This plugin uses the Kubernetes plugin for authentication. 

#### Using configured Kubernetes API

The plugin uses configured Kubernetes clusters to fetch resources.

For example, for a Kubernetes cluster given in your `app-config.yaml`

```yaml
kubernetes:
  serviceLocatorMethod:
    type: "multiTenant"
  clusterLocatorMethods:
    - type: "config"
      clusters:
        - url: https://abcd.gr7.us-west-2.eks.amazonaws.com:443
          name: my-cluster-1
          authProvider: "serviceAccount"
          serviceAccountToken: eyJh
          caData: LS0t
```

For this configuration, the `apache-spark.cnoe.io/cluster-name` annotation value must be `my-cluster-1`. If this is not specified, the first cluster in the list is selected.

```yaml
apiVersion: backstage.io/v1alpha1
kind: Component
metadata:
  name: backstage
  annotations:
    backstage.io/kubernetes-namespace: default
    apache-spark.cnoe-io/label-selector: env=dev,my=label
    apache-spark.cnoe.io/cluster-name: my-cluster-1
spec:
  type: service
  lifecycle: experimental
  owner: user1
  system: system1
```
